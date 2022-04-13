const db = require("../db/connection.js");

exports.fetchUsers = () => {
  return db
  .query("SELECT username, avatar_url FROM users;")
  .then((users) => {
    return users.rows;
  });
};

exports.fetchUser = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then((user) => {
      return user.rows[0];
    });
};
