const storageValidator = require("../helpers/storage_validator");
const Storage = require("../models/storage");

class Controller {
	static async getStorage(req, res) {
		let page = parseInt(req.query.page);
		let limit = 10;
		const documentsCount = await Storage.findDocumentsCount();
		const howManyPages = Math.ceil(documentsCount / limit);

		if (page <= 0) {
			res.status(404).json({ message: "invalid page number, should start with 1" });
		} else {
			let skippedData = (page - 1) * limit;
			Storage.findAll(skippedData, limit).then((data) => {
				res.status(200).json({ data, howManyPages });
			});
		}
	}

	static getOneStorage(req, res) {
		const id = req.params.id;

		Storage.findOne(id).then((data) => {
			if (data === null) {
				res.status(404).json({ message: `Data not found` });
			} else {
				res.status(200).json(data);
			}
		});
	}

	static postStorage(req, res) {
		const newStorage = {
			image: req.body.image,
			name: req.body.name,
			capacity: req.body.capacity,
			type: req.body.type,
			price: +req.body.price,
			stock: +req.body.stock,
		};

		const { errors, errorFlag } = storageValidator(newStorage);

		if (errorFlag) {
			res.status(400).json({ message: errors });
		} else {
			Storage.create(newStorage)
				.then((data) => {
					res.status(201).json(data.ops[0]);
				})
				.catch((err) => {
					res.status(500).json({ message: "Server Error" });
				});
		}
	}

	static putStorage(req, res) {
		const id = req.params.id;

		const updatedStorage = {
			image: req.body.image,
			name: req.body.name,
			capacity: req.body.capacity,
			type: req.body.type,
			price: +req.body.price,
			stock: +req.body.stock,
		};

		const { errors, errorFlag } = storageValidator(updatedStorage);

		if (errorFlag) {
			res.status(400).json({ message: errors });
		} else {
			Storage.update(id, updatedStorage).then((data) => {
				if (data.matchedCount == 0) {
					res.status(404).json({ message: `Data not Found` });
				} else if (data.matchedCount == 1 && data.modifiedCount == 1) {
					res.status(200).json({ message: `Succesfully edited the Storage` });
				}
			});
		}
	}

	static deleteStorage(req, res) {
		const id = req.params.id;

		Storage.destroy(id)
			.then((data) => {
				if (data.deletedCount == 0) {
					res.status(404).json({ message: `Data not Found` });
				} else if (data.deletedCount == 1) {
					res.status(200).json({ message: `Succesfully deleted the Storage` });
				}
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}
}

module.exports = Controller;
