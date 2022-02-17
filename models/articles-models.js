const db = require("../db/connection.js");

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT author, title, article_id, topic, created_at, votes FROM articles
  ORDER BY created_at ASC;`
    )
    .then((articles) => {
      return articles.rows; //array of all articles on db
    });
};

exports.fetchArticleById = (articleId) => {
  return db
    .query(`SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, COUNT(articles.article_id) AS comment_count FROM articles 
    JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [articleId])
    .then((article) => {
      console.log(article.rows[0], "response in model")
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
  return db
    .query(
      `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *; `,
      [articleId, vote]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `article ${articleId} not found`,
        });
      }
      // article = result object
      // article.rows = returned array from SQL query
      return article.rows[0];
    });
};
