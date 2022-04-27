const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require("../controllers/articles-controllers");
const {
  getCommentsByArticleId,
  postCommentById,
} = require("../controllers/comments-controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentById);


module.exports = articlesRouter;