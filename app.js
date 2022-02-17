const express = require("express");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index");

const { getTopics } = require("./controllers/topics-controllers.js");

const { getArticleById, patchArticleById } = require("./controllers/articles-controllers.js");

const { getUsers } = require("./controllers/users-controllers");

//----APP-------------------------

const app = express();

app.use(express.json());

app.get(`/api/topics`, getTopics); //passes to controller

app.get(`/api/articles/:article_id`, getArticleById);

app.get(`/api/users`, getUsers);

app.patch(`/api/articles/:article_id`, patchArticleById);

//------GENERIC ENDPOINT ERROR CATCH-------------------

app.all("/*", (req, res) => {
  console.log(res, "error at 404 app level");
  res.status(404).send({ msg: "path not found" });
});

//------ERROR HANDLING------------------------------------

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
