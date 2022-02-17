const {fetchUsers} = require("../models/users-models.js");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      console.log(users); //returned promise from model. Resolves to array of objects.
      res.status(200).send({ users });
    })
    .catch((err) => {
      console.log(err, "error at getUsers controller");
      next(err);
    });
};
