// Basic server setup
var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

// Specify template engine to EJS
app.set("view engine", "ejs");

// Require my modules
const urlDatabase = require('./my_modules/url-database.js');

/* ::::::::::::::::::::::::::::: */
/* :::::::: GET REQUESTS ::::::: */
/* ::::::::::::::::::::::::::::: */

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});

// Indicate port for the server to listen on
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

