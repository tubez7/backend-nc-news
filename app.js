const express = require("express");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors/index");
const { getTopics } = require("./controllers/topics-controllers.js");
const { getArticleById, patchArticleById, getArticles } = require("./controllers/articles-controllers.js");
const { getUsers, getUser } = require("./controllers/users-controllers");
const { postCommentById, getCommentsByArticleId, deleteCommentById } = require("./controllers/comments-controllers");
const { getApi } = require("./controllers/api-controllers");
const cors = require("cors");

//-------APP-------

const app = express();

app.use(express.json());

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//-------ENDPOINTS-------

app.get(`/api`, getApi);

app.get(`/api/topics`, getTopics); 

app.get(`/api/articles`, getArticles);

app.get(`/api/articles/:article_id`, getArticleById);

app.get(`/api/users`, getUsers);

app.get(`/api/users/:username`, getUser);

app.get(`/api/articles/:article_id/comments`, getCommentsByArticleId);

app.patch(`/api/articles/:article_id`, patchArticleById);

app.post(`/api/articles/:article_id/comments`, postCommentById);

app.delete(`/api/comments/:comment_id`, deleteCommentById);

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
  






