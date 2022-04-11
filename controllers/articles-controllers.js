const {
  fetchArticleById,
  updateArticleById,
  fetchArticles,
} = require("../models/articles-models.js");

exports.getArticles = (req, res, next) => {
  const { sort_by: sortBy, order, topic } = req.query;
  fetchArticles(sortBy, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id: articleId } = req.params; 
  fetchArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { inc_votes: vote } = req.body; 
  const { article_id: articleId } = req.params; 
  updateArticleById(articleId, vote)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
