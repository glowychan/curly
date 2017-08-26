const urlDatabase = require('./url-database.js');

// This helper function filters urlDatabase by userID
module.exports = function urlsForUser(id) {
  var result = {};
  for (var key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      result[key] = { longURL: urlDatabase[key].longURL};
    }
  }
  return result;
}