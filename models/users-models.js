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
      if (user.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `username ${username} does not exist`,
        });
      }
      return user.rows[0];
    });
};
