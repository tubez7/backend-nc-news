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
  const { article_id: articleId } = req.params; // req.params = { article_id: '1' }
  fetchArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { inc_votes: vote } = req.body; //deconstruct inc_votes from req.body & rename as variable vote
  const { article_id: articleId } = req.params; //deconstruct article_id from req.params & rename as variable articleId
  updateArticleById(articleId, vote)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
