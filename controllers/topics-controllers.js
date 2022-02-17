const {fetchTopics} = require("../models/topics-models.js");


exports.getTopics = (req, res, next) => {
    fetchTopics()
      .then((topics) => {
        // returned promise from model. Array of objects.
        res.status(200).send({ topics: topics });
      })
      .catch((err) => {
        next(err);
      });
  };