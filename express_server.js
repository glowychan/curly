// Basic server setup
var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

// Specify template engine to EJS
app.set("view engine", "ejs");

// Require helper modules
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// Require my modules
const urlDatabase = require('./my_modules/url-database.js');
const generateRandomString = require('./my_modules/random-stringer.js');

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

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});

/* ::::::::::::::::::::::::::::: */
/* ::::::: POST REQUESTS ::::::: */
/* ::::::::::::::::::::::::::::: */
app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

// Indicate port for the server to listen on
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

