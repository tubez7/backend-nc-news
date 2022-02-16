const db = require("../db/connection.js");

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics;").then((result) => {
      console.log(result); //Object. Key of rows is array of topic objects
      return result.rows;
    });
  };