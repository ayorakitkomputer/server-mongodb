const monitorValidator = require("../helpers/monitor_validator");
const Monitor = require("../models/monitor");

class Controller {
	static getMonitor(req, res, next) {
		Monitor.findAll()
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static getOneMonitor(req, res, next) {
		const id = req.params.id;

		Monitor.findOne(id)
			.then((data) => {
				if (data === null) {
					res.status(404).json({ message: `Data not found` });
				} else {
					res.status(200).json(data);
				}
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static postMonitor(req, res, next) {
		const newMonitor = {
			name: req.body.name,
			size: req.body.size,
			manufacturer: req.body.manufacturer,
			price: req.body.price,
			stock: req.body.stock,
			image: req.body.image,
		};

		const { errors, errorFlag } = monitorValidator(newMonitor);

		if (errorFlag) {
			res.status(400).json({ message: errors });
		} else {
			Monitor.create(newMonitor)
				.then((data) => {
					res.status(201).json(data.ops[0]);
				})
				.catch((err) => {
					res.status(500).json({ message: "Server Error" });
				});
		}
	}

	static putMonitor(req, res, next) {
		const id = req.params.id;

		const updatedMonitor = {
			name: req.body.name,
			size: req.body.size,
			manufacturer: req.body.manufacturer,
			price: req.body.price,
			stock: req.body.stock,
			image: req.body.image,
		};

		const { errors, errorFlag } = monitorValidator(updatedMonitor);

		if (errorFlag) {
			res.status(400).json({ message: errors });
		} else {
			Monitor.update(id, updatedMonitor)
				.then((data) => {
					if (data.matchedCount == 0) {
						res.status(404).json({ message: `Data not Found` });
					} else if (data.matchedCount == 1 && data.modifiedCount == 0) {
						res
							.status(200)
							.json({ message: `The updated data is the same, so no changes are made` });
					} else if (data.matchedCount == 1 && data.modifiedCount == 1) {
						res.status(200).json({ message: `Succesfully edited the Monitor` });
					}
				})
				.catch((err) => {
					res.status(500).json({ message: err.message });

					res.status(500).json({ message: "Server Error" });
				});
		}
	}

	static deleteMonitor(req, res, next) {
		const id = req.params.id;

		Monitor.destroy(id)
			.then((data) => {
				if (data.deletedCount == 0) {
					res.status(404).json({ message: `Data not Found` });
				} else if (data.deletedCount == 1) {
					res.status(200).json({ message: `Succesfully deleted the Monitor` });
				}
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });

				res.status(500).json({ message: "Server Error" });
			});
	}
}

module.exports = Controller;
