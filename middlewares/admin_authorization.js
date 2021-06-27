const Users = require("../models/users");

module.exports = (req, res, next) => {
  if (req.currentUser.role === "Admin") {
    next();
  }
};
