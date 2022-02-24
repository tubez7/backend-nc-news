const { insertCommentById } = require("../models/comments-models");

exports.postCommentById = (req, res, next) => {
  //   console.log(req, "whole request object");

  const { article_id: articleId } = req.params; //article_id on params
  const { username, body: commentBody } = req.body; //destructure username & destructure + rename body on req.body 
  
  insertCommentById(commentBody, articleId, username)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      if (err.constraint === "comments_article_id_fkey") {
        res.status(404).send({ msg: `article ${articleId} not found` });
      } else {
        next(err);
      }
    });
};
