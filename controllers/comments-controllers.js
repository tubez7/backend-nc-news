const { checkArticleExists } = require("../models/articles-models");
const {
  insertCommentById,
  fetchCommentsByArticleId,
  removeCommentById,
} = require("../models/comments-models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id: articleId } = req.params;
  Promise.all([
    fetchCommentsByArticleId(articleId), 
    checkArticleExists(articleId), 
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentById = (req, res, next) => {
  const { article_id: articleId } = req.params; 
  const { username, body: commentBody } = req.body; 

  insertCommentById(commentBody, articleId, username)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id: commentId } = req.params;
  removeCommentById(commentId)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
      

