const db = require("../db/connection.js");

exports.fetchUsers = () => {
  return db.query("SELECT username, avatar_url FROM users;")
  .then((users) => {
    return users.rows;
  });
};
