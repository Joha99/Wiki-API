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

//////////////////////////////////////// requests targeting all articles ////////////////////////////////////////
app
  .route("/articles")
  .get(function (req, res) {
    Article.find({}, function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const articleTitle = req.body.title;
    const articleContent = req.body.content;
    const newArticle = new Article({
      title: articleTitle,
      content: articleContent,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new wiki article.");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany({}, function (err) {
      if (!err) {
        res.send("Successfully deleted all wiki articles.");
      } else {
        res.send(err);
      }
    });
  });

//////////////////////////////////////// requests targeting a specific article ////////////////////////////////////////
app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle }, function (
      err,
      foundArticle
    ) {
      if (!err && foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("There was an issue getting requested article.");
      }
    });
  })
  .put(function (req, res) {
    // replace existing article with title "articleTitle" with new "title" and "content"
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send(
            "Successfully updated " +
              req.params.articleTitle +
              " article to " +
              req.body.title +
              " article."
          );
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfully updated article."); 
        } else {
          res.send(err); 
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("Successfully removed one article."); 
      } else {
        res.send(err); 
      }
    });
  });

app.listen(3000, function () {
  console.log("Server running on port 3000.");
});
