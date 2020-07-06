const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app.get("/", function (req, res) {
  res.send("App loaded.");
});

app.get("/articles", function (req, res) {
  Article.find({}, function (err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
});

app.post("/articles", function (req, res) {
  console.log(req.body.title);
  console.log(req.body.content);

  const wikiTitle = _.lowerCase(req.body.title);
  const wikiContent = req.body.content;

  const newWiki = new Article({ title: wikiTitle, content: wikiContent });
  
  newWiki.save(function (err) {
    if (!err) {
      res.send("Successfully added a new wiki article."); 
    } else {
      res.send(err); 
    }
  });
});

app.listen(3000, function () {
  console.log("Server running on port 3000.");
});
