const db = require("../db/connection.js");

exports.fetchArticleById = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `article ${articleId} not found`,
        });
      }
      return article.rows[0];
    });
};

exports.updateArticleById = (articleId, vote) => {
  console.log(articleId, vote, "inside the model");
  return db
    .query(
      `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *; `,
      [articleId, vote]
    )
    .then((article) => {
      console.log(article, "article"); //result object
      console.log(article.rows, `article.rows`); //returned array from SQL query
      console.log(article.rows[0]); //object at 0 index
      return article.rows[0];
    });
};
