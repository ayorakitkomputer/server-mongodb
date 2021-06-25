const Builds = require("../models/builds");

module.exports = (req, res, next) => {
	if (req.params.id) {
		let id = req.params.id;
		Builds.findByPk(id)
			.then((data) => {
				if (data.user.id.toString() === req.currentUser.id.toString()) {
					next();
				} else {
					res.status(400).json({ message: "Unauthorized" });
				}
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	} else {
		res.status(400).json({ message: "Page Not Found" });
	}
};
