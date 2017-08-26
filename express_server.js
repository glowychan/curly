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
const generateRandomString = require('./my_modules/random-stringer.js');
const users = require('./my_modules/users-database.js');
const urlDatabase = require('./my_modules/url-database.js');
const urlsForUser = require('./my_modules/user-urls.js');

/* ::::::::::::::::::::::::::::: */
/* :::::::: GET REQUESTS ::::::: */
/* ::::::::::::::::::::::::::::: */

// Render index
app.get("/", (req, res) => {
  res.end("Hello!");
});

// Render registration endpoint
app.get("/register", (req, res) => {
  if (users[req.session.user_id]) {
    res.redirect("/urls");
  } else {
    res.render("register");
  }
});

// Render login endpoint
app.get("/login", (req, res) => {
  if (users[req.session.user_id]) {
    res.redirect("/urls");
  } else {
    res.render("login");
  }
});

// Render urls_index endpoint
app.get("/urls", (req, res) => {
  if (users[req.session.user_id]) {
    let templateVars = {
      urls: urlsForUser(users[req.session.user_id].id),
      user_id: users[req.session.user_id],
      email: users[req.session.user_id].email
    };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});

// Render urls_new endpoint
app.get("/urls/new", (req, res) => {
  if (users[req.session.user_id]) {
    let templateVars = {
      user_id: users[req.session.user_id],
      email: users[req.session.user_id].email
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

// Redirect shorturls to its external website
app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.send("Invalid link");
  } else {
    let longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  }
});

// Render urls/:id endpoint
app.get("/urls/:id", (req, res) => {
  if (users[req.session.user_id]) {
    if (users[req.session.user_id].id === urlDatabase[req.params.id].userID) {
      let templateVars = {
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id],
      user_id: users[req.session.user_id],
      email: users[req.session.user_id].email,
    };
    res.render("urls_show", templateVars);
    } else {
      res.send("Link does not belong to user");
    }
  } else {
    res.redirect("/login");
  }
});

/* ::::::::::::::::::::::::::::: */
/* ::::::: POST REQUESTS ::::::: */
/* ::::::::::::::::::::::::::::: */

// Submit registration form data and receive cookie from server
app.post("/register", (req, res) => {
  for (let key in users) {
    if (users[key].email === req.body.email) {
      res.status(404).send("User email is already registered");

    } else {
      let id = generateRandomString();
        users[id] = {
        id: id,
        email: req.body.email,
        password: req.body.password
      };

      if (!users[id].email || !users[id].password) {
        res.status(404).send("Invalid email or password");
        return;
      }

      req.session.user_id = id;
      res.redirect("/urls");
      return;
    }
  }
});

// Allow user to login and receive cookie from server
app.post("/login", (req, res) => {
  let foundUser = false;
  for (let key in users) {
    if (users[key].email === req.body.email) {
      foundUser = key;
    }
  }
  if (foundUser) {
    if (req.body.password === users[foundUser].password) {
      req.session.user_id = foundUser;
      res.redirect("/");
    } else {
      res.status(403).send("Invaid password");
    }
  } else {
    res.status(403).send("Email is not registered");
  }
});

// Allow user to logout and clear cookie from server
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// Allow user to create a shorturl to server
app.post("/urls", (req, res) => {
  if (req.body.longURL.includes('http://')) {
    let shortURL = generateRandomString();
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: users[req.session.user_id].id,
      views: 0,
      visitors: []
    }
   res.redirect(`/urls/${shortURL}`);
  } else {
    res.send("Invalid link");
  }
});

/* ::::::::::::::::::::::::::::: */
/* :::::: DELETE REQUESTS :::::: */
/* ::::::::::::::::::::::::::::: */

// Allow server to delete a shorturl from server
app.delete("/urls/:id", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// Indicate port for the server to listen on
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
