const {
  fetchArticleById,
  updateArticleById,
} = require("../models/articles-models.js");

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
      res.status(201).send({ article });
    })
    .catch((err) => {
      console.log(err, "catch block of controller");
      next(err);
    });
};
