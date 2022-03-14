const db = require("../db/connection.js");

exports.fetchCommentsByArticleId = (articleId) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1;`, [articleId])
    .then((res) => {
      return res.rows; //res.rows is the array of comments
    });
};

exports.insertCommentById = (commentBody, articleId, username) => {
  return db
    .query(
      `INSERT INTO COMMENTS (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;`,
      [commentBody, articleId, username]
    )
    .then((res) => {
      return res.rows[0]; //returns the body property on the DB response
    });
};

exports.removeCommentById = (commentId) => {
  console.log(commentId, "inside delete model");
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      commentId,
    ])
    .then((res) => {
      console.log(res.rows, "deleted comment in model");
      return res.rows[0];
    });
};
