const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.ACCESS_TOKEN;

const sign = (payload) => {
	return jwt.sign(payload, JWT_SECRET);
};

const verify = (token) => {
	return jwt.verify(token, JWT_SECRET);
};

module.exports = { sign, verify };
