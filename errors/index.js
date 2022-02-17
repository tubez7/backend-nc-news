exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    console.log(err, "INSIDE CUSTOM ERROR BLOCK - error handler");
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    console.log(err, "INSIDE 400 BAD REQUEST - error handler");
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err, "SERVER 500 ERROR BLOCK");
  res.status(500).send({ msg: "internal server error" });
};