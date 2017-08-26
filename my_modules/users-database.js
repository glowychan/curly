const bcrypt = require('bcrypt');

module.exports = {
  Z4MzGX: {
    id: "Z4MzGX",
    email: "user@example.com",
    password: bcrypt.hashSync("purple", 10)
  },
  OdQV0n: {
    id: "OdQV0n",
    email: "user2@example.com",
    password: bcrypt.hashSync("dish", 10)
  }
};