const db = require("../db/connection.js");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;")
  .then((topics) => {
    return topics.rows;
  });
};
