const {fetchTopics} = require("../models/topics-models.js");


exports.getTopics = (req, res, next) => {
    fetchTopics()
      .then((topics) => {
        console.log(topics);// returned promise from model. Array of objects.
        res.status(200).send({ topics: topics });
      })
      .catch((err) => {
        console.log(err, "error at getTopics controller");
        next(err);
      });
  };