const db = require("../db/connection.js");

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
