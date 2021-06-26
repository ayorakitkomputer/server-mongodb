const bcrypt = require("bcryptjs");

const encode = (password) => {
	return bcrypt.hashSync(password, 8);
};

const decode = (password, hashed_password) => {
	return bcrypt.compareSync(password, hashed_password);
};

module.exports = { encode, decode };
