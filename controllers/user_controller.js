const Users = require("../models/users");
const { decode } = require("../helpers/bcryptjs");
const { sign } = require("../helpers/jwt");

class UserController {
	static register(req, res) {
		const { email, password, address, firstname, lastname } = req.body;
		if (!email || !password || !address || !firstname || !lastname) {
			res.status(400).json({ message: "All fields required" });
		} else {
			if (
				typeof email === "string" &&
				typeof password === "string" &&
				typeof address === "string" &&
				typeof firstname === "string" &&
				typeof lastname === "string"
			) {
				const newUser = {
					email,
					password,
					address,
					firstname,
					lastname,
					role: "Customer",
				};

				Users.findOne(email)
					.then((data) => {
						if (data) {
							return false;
						} else {
							return Users.create(newUser);
						}
					})
					.then((data) => {
						if (data) {
							const { _id, email, address, firstname, lastname } = data.ops[0];
							res.status(201).json({ id: _id, email, address, firstname, lastname });
						} else {
							res.status(400).json({ message: "User has already register before" });
						}
					})
					.catch((err) => {
						res.status(500).json({ message: err.message });
					});
			} else {
				res.status(400).json({ message: "Oops there seems an error on your data types" });
			}
		}
	}

	static login(req, res) {
		const { email, password } = req.body;

		if (!email || !password) {
			res.status(500).json({ message: "Email or Password required" });
		} else if (typeof email === "string" && typeof password === "string") {
			Users.findOne(email)
				.then((data) => {
					if (data) {
						if (decode(password, data.password)) {
							const { _id, email, fullname, lastname } = data;
							const access_token = sign({ id: _id, email, fullname, lastname });
							res.status(200).json({ access_token });
						} else {
							res.status(400).json({ message: "Invalid Password" });
						}
					} else {
						res.status(400).json({ message: "User Not Found" });
					}
				})
				.catch((err) => {
					res.status(500).json({ message: err.message });
				});
		} else {
			res.status(400).json({ message: "Oops there seems an error on your data types" });
		}
	}
}

module.exports = UserController;
