const db = require("../db/connection.js");

exports.fetchArticles = (sortBy, order, topic) => {
  console.log(sortBy, order, topic, "topic in model");
  const queryValues = [];

  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INT) AS comment_count 
  FROM articles
  FULL JOIN comments 
  ON articles.article_id = comments.article_id`;

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
    }

  if (sortBy && !order) {
    return db
      .query(
        queryStr + ` GROUP BY articles.article_id ORDER BY ${sortBy} DESC;`,
        queryValues
      )
      .then((articles) => {
        return articles.rows; 
      });
  } else if (!sortBy && order) {
    return db
      .query(
        queryStr + ` GROUP BY articles.article_id ORDER BY created_at ${order}`,
        queryValues
      )
      .then((articles) => {
        return articles.rows;
      });
  } else if (sortBy && order) {
    return db
      .query(
        queryStr + ` GROUP BY articles.article_id ORDER BY ${sortBy} ${order};`,
        queryValues
      )
      .then((articles) => {
        return articles.rows;
      });
  } else {
    return db
      .query(
        queryStr + ` GROUP BY articles.article_id ORDER BY created_at DESC;`,
        queryValues
      )
      .then((articles) => {
        return articles.rows; //array of all articles on db
      });
  }
};

exports.fetchArticleById = (articleId) => {
  return db
    .query(
      `SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
      [articleId]
    )
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

exports.checkArticleExists = (articleId) => {
  return db
    .query(`SELECT * FROM articles where article_id = $1`, [articleId])
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `article ${articleId} not found`,
        });
      }
    });
};

`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INT) AS comment_count 
  FROM articles
  FULL JOIN comments 
  ON articles.article_id = comments.article_id 
  GROUP BY articles.article_id
  ORDER BY created_at DESC;`;
