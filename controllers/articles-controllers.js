const {
  fetchArticleById,
  updateArticleById,
  fetchArticles,
} = require("../models/articles-models.js");

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      // articles = should be an array received from the model
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  // req = obj with a params key
  // req.params = { article_id: '1' }
  const { article_id: articleId } = req.params;
  fetchArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article }); //sends article object on key of article
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { inc_votes: vote } = req.body;
  const { article_id: articleId } = req.params; //deconstruct article_id & rename articleId
  updateArticleById(articleId, vote)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
