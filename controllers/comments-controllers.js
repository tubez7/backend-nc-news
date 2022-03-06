const { checkArticleExists } = require("../models/articles-models");
const {
  insertCommentById,
  fetchCommentsByArticleId,
} = require("../models/comments-models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id: articleId } = req.params;
  Promise.all([
    fetchCommentsByArticleId(articleId), //returns promise that resolves to an array - comments[0];
    checkArticleExists(articleId), //returns undefined promise - comments[1]
  ])
    .then(([comments]) => {
      //Promise.all returns a promise that resolves as an array. [comments] destructures and takes 1st value in array

      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentById = (req, res, next) => {
  const { article_id: articleId } = req.params; //article_id on params
  const { username, body: commentBody } = req.body; //destructure username & destructure + rename body on req.body

  insertCommentById(commentBody, articleId, username)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

