const {
  fetchArticleById,
  updateArticleById,
  fetchArticles,
  insertArticle,
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

exports.postArticle = (req, res, next) => {
  // console.log(req.body, "req.body", req.params, "req.params");
  const { author, title, body, topic } = req.body;
  // console.log(author, title, body, topic, "article vars");
  insertArticle(author, title, body, topic)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
