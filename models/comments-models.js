const db = require("../db/connection.js");

exports.fetchCommentsByArticleId = (articleId) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1;`, [articleId])
    .then((comments) => {
      return comments.rows;
    });
};

exports.insertCommentById = (commentBody, articleId, username) => {
  return db
    .query(
      `INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;`,
      [commentBody, articleId, username]
    )
    .then((comment) => {
      return comment.rows[0];
    });
};

exports.removeCommentById = (commentId) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      commentId,
    ])
    .then((comment) => {
      if (comment.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `comment ${commentId} not found`,
        });
      }
      return comment.rows[0];
    });
};

exports.updateCommentById = (commentId, vote) => {
  return db
    .query(
      `UPDATE comments SET votes = votes + $2 WHERE comment_id = $1 RETURNING *;`,
      [commentId, vote]
    )
    .then((comment) => {
      if (comment.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `comment ${commentId} not found`,
        });
      }
      return comment.rows[0];
    });
};
