exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.constraint === "comments_author_fkey") {
    res.status(400).send({ msg: "bad request - INVALID USERNAME" });
  } else if (err.constraint === "comments_article_id_fkey") {
    const articleId = parseInt(req.originalUrl.match(/\d+/));
    res.status(404).send({ msg: `article ${articleId} not found` });
  } else if (err.constraint === "articles_author_fkey") {
    res.status(400).send({ msg: "bad request - INVALID USERNAME" });
  } else if (err.constraint === "articles_topic_fkey") {
    res.status(400).send({ msg: "bad request - INVALID TOPIC" });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
};
