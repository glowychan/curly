// Basic server setup
var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

// Specify template engine to EJS
app.set("view engine", "ejs");

// Require helper modules
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const cookieSession = require('cookie-session');
app.use(cookieSession({
  keys: ['user_id']
}));

// Require my modules
const urlDatabase = require('./my_modules/url-database.js');
const users = require('./my_modules/users-database.js');
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

app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.send("Invalid link");
  } else {
    let longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  }
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});

/* ::::::::::::::::::::::::::::: */
/* ::::::: POST REQUESTS ::::::: */
/* ::::::::::::::::::::::::::::: */
app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.post("/login", (req, res) => {
  req.session.user_id = req.params.body;
  res.send("ok");
  return;
});



// Indicate port for the server to listen on
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

/* ::::::::::::::::::::::::::::: */
/* :::::: DELETE REQUESTS :::::: */
/* ::::::::::::::::::::::::::::: */

// Allow server to delete a shorturl from server
app.delete("/urls/:id", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});
