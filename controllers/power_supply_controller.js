const Power_supply_Validator = require("../helpers/Power_supply_validator");
const Builds = require("../models/builds");
const Power_supply = require("../models/Power_supply");

class Controller {
	static getPower_supply(req, res, next) {
		let page = parseInt(req.query.page);
		let limit = 10;
		if (page < 0 || page === 0) {
			return res.status(404).json({ message: "invalid page number, should start with 1" });
		} else {
			let skippedData = (page - 1) * limit;
			Power_supply.findAll(skippedData, limit).then((data) => {
				res.status(200).json(data);
			});
		}
	}
	static getByWatt(req, res) {
		let page = parseInt(req.query.page);
		let limit = 10;
		const { id } = req.params;
		if (page < 0 || page === 0) {
			res.status(400).json({ message: "invalid page number, should start with 1" });
		}
		Builds.findByPk(id)
			.then((data) => {
				let currentWattage = 0;
				currentWattage += data.cpu.tdp;
				buildData.gpu.forEach((gpuData) => {
					currentWattage += gpuData.tdp;
				});
				return Power_supply.findAllByWatt(skippedData, limit, currentWattage);
			})
			.then((data) => {
				if (data) res.status(200).json(data);
				res.status(400).json({ message: "Data not found" });
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static getOnePower_supply(req, res, next) {
		const id = req.params.id;

		Power_supply.findOne(id).then((data) => {
			if (data === null) {
				res.status(404).json({ message: `Data not found` });
			} else {
				res.status(200).json(data);
			}
		});
	}

	static postPower_supply(req, res, next) {
		const newPower_supply = {
			image: req.body.image,
			name: req.body.name,
			efficiency_rating: req.body.efficiency_rating,
			wattage: req.body.wattage,
			price: req.body.price,
			stock: req.body.stock,
		};

		const { errors, errorFlag } = Power_supply_Validator(newPower_supply);

		if (errorFlag) {
			res.status(400).json({ message: errors });
		} else {
			Power_supply.create(newPower_supply).then((data) => {
				res.status(201).json(data.ops[0]);
			});
		}
	}

	static putPower_supply(req, res, next) {
		const id = req.params.id;

		const updatedPower_supply = {
			image: req.body.image,
			name: req.body.name,
			efficiency_rating: req.body.efficiency_rating,
			wattage: req.body.wattage,
			price: req.body.price,
			stock: req.body.stock,
		};

		const { errors, errorFlag } = Power_supply_Validator(updatedPower_supply);

		if (errorFlag) {
			res.status(400).json({ message: errors });
		} else {
			Power_supply.update(id, updatedPower_supply)
				.then((data) => {
					if (data.matchedCount == 0) {
						res.status(404).json({ message: `Data not Found` });
					} else if (data.matchedCount == 1 && data.modifiedCount == 1) {
						res.status(200).json({ message: `Succesfully edited the Power Supply` });
					}
				})
				.catch((err) => {
					res.status(500).json({ message: err.message });
				});
		}
	}

	static deletePower_supply(req, res, next) {
		const id = req.params.id;

		Power_supply.destroy(id)
			.then((data) => {
				if (data.deletedCount == 0) {
					res.status(404).json({ message: `Data not Found` });
				} else if (data.deletedCount == 1) {
					res.status(200).json({ message: `Succesfully deleted the Power Supply` });
				}
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}
}

module.exports = Controller;
