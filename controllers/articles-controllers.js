const {
  fetchArticleById,
  updateArticleById,
  fetchArticles,
} = require("../models/articles-models.js");

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      console.log(articles); //should be an array received from the model
      res.status(200).send({ articles });
    })
    .catch((err) => {
      console.log(err, "catch block controller")
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  // console.log(req); //obj with a params key
  // console.log(req.params); //{ article_id: '1' }
  const { article_id: articleId } = req.params;
  fetchArticleById(articleId)
    .then((article) => {
      console.log({ article }, "inside controller");
      res.status(200).send({ article }); //sends article object on key of article
    })
    .catch((err) => {
      console.log(err, "catch block of controller");
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { inc_votes: vote } = req.body;
  const { article_id: articleId } = req.params; //deconstruct article_id & rename articleId
  updateArticleById(articleId, vote)
    .then((article) => {
      console.log(article, "inside then block of controller");
      res.status(200).send({ article });
    })
    .catch((err) => {
      console.log(err, "catch block of controller");
      next(err);
    });
};
