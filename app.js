const express = require("express");
const {getTopics} = require("./controllers/controllers.js");


const app = express();

app.use(express.json());


app.get(`/api/topics`, getTopics); //passes to controller


app.all("/*", (req, res) => {
    console.log(res, "error at app level")
    res.status(404).send({ msg: "path not found" });
  });


module.exports = app;