// This helper function generates a random string 6 characters long
module.exports = function() {
  let id = "";
  const source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    id += source.charAt(Math.floor(Math.random() * source.length));
  }
  return id;
}