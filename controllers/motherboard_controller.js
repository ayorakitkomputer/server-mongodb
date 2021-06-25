const Motherboard = require("../models/motherboard");
const motherboardValidation = require("../helpers/motherboard_validator");

class Controller {
	static showAllMotherboard(req, res) {
		Motherboard.findAll()
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}
	static showOneMotherboard(req, res, next) {
		let id = req.params.id;
		Motherboard.findById(id)
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}
	static addMotherboard(req, res, next) {
		let newMotherboard = {
			name: req.body.name,
			image: req.body.image,
			socket: req.body.socket,
			memory_type: req.body.memory_type,
			manufacturer: req.body.manufacturer,
			form_factor: req.body.form_factor,
			price: req.body.price,
			stock: req.body.stock,
		};
		const { validated, errors } = motherboardValidation(newMotherboard);
		if (validated) {
			Motherboard.create(newMotherboard)
				.then((data) => {
					res.status(201).json(data.ops[0]);
				})
				.catch((err) => {
					res.status(500).json({ message: err.message });
				});
		} else {
			res.status(400).json(errors);
		}
	}
	static editMotherboard(req, res, next) {
		let id = req.params.id;
		let editedMotherboard = {
			name: req.body.name,
			image: req.body.image,
			socket: req.body.socket,
			memory_type: req.body.memory_type,
			manufacturer: req.body.manufacturer,
			form_factor: req.body.form_factor,
			price: req.body.price,
			stock: req.body.stock,
		};

		const { validated, errors } = motherboardValidation(editedMotherboard);
		if (validated) {
			Motherboard.update(id, editedMotherboard)
				.then(() => {
					res.status(200).json({ message: "sucessfully edited" });
				})
				.catch((err) => {
					res.status(500).json({ message: err.message });
				});
		} else {
			res.status(400).json(errors);
		}
	}
	static deleteMotherboard(req, res, next) {
		let id = req.params.id;
		Motherboard.destroy(id)
			.then(() => {
				res.status(200).json({ message: "succesfully deleted" });
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}
}

module.exports = Controller;
