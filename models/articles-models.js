const db = require("../db/connection.js");

exports.fetchArticles = (sortBy = "created_at", order = "DESC", topic) => {
  const queryValues = [];

  if (
    ![
      "title",
      "topic",
      "author",
      "body",
      "created_at",
      "votes",
      "comment_count",
    ].includes(sortBy)
  ) {
    return Promise.reject({
      status: 400,
      msg: "bad request - INVALID SORT QUERY",
    });
  }

  if (!["asc", "desc", "ASC", "DESC"].includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "bad request - INVALID ORDER QUERY",
    });
  }

  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INT) AS comment_count 
  FROM articles
  FULL JOIN comments 
  ON articles.article_id = comments.article_id`;

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }
  return db
    .query(
      queryStr + ` GROUP BY articles.article_id ORDER BY ${sortBy} ${order};`,
      queryValues
    )
    .then((articles) => {
      return articles.rows;
    });
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

exports.insertArticle = (author, title, body, topic) => {
  return db
    .query(
      `INSERT INTO articles (author, title, body, topic) 
  VALUES ($1, $2, $3, $4) 
  RETURNING article_id;`,
      [author, title, body, topic]
    )
    .then(({ rows }) => {
      const { article_id: articleId } = rows[0];
      return this.fetchArticleById(articleId);
    });
};