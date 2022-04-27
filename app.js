const express = require("express");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors/index");

const cors = require("cors");
const apiRouter = require("./routes/api-router");

//-------APP-------

const app = express();

app.use(express.json());

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//-------ROUTER-------

app.use("/api", apiRouter);

//-------GENERIC ENDPOINT ERROR CATCH-------

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

//-------ERROR HANDLING-------

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

//--------------

module.exports = app;