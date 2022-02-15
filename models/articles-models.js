const db = require("../db/connection.js");

exports.fetchArticleById = (articleId) => {
    return db
      .query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
      .then((article) => {
        console.log(article, "article");
        console.log(article.rows, `article.rows`);
        console.log(article.rows[0], `article.rows[0]`);
        if (article.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: `article ${articleId} not found`,
          });
        }
        return article.rows[0];
      });
  };