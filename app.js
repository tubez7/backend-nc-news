const express = require("express");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors/index");
const { getTopics } = require("./controllers/topics-controllers.js");
const { getArticleById, patchArticleById, getArticles } = require("./controllers/articles-controllers.js");
const { getUsers } = require("./controllers/users-controllers");
const { postCommentById, getCommentsByArticleId, deleteCommentById } = require("./controllers/comments-controllers");
const { getApi } = require("./controllers/api-controllers");

//-------APP-------

const app = express();

app.use(express.json());

//-------ENDPOINTS-------

app.get(`/api`, getApi);

app.get(`/api/topics`, getTopics); 

app.get(`/api/articles`, getArticles);

app.get(`/api/articles/:article_id`, getArticleById);

app.get(`/api/users`, getUsers);

app.get(`/api/articles/:article_id/comments`, getCommentsByArticleId);

app.patch(`/api/articles/:article_id`, patchArticleById);

app.post(`/api/articles/:article_id/comments`, postCommentById);

app.delete(`/api/comments/:comment_id`, deleteCommentById)

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
  






