const Memory = require("../models/memory");
const memoryValidation = require("../helpers/memory_validator");
const Builds = require("../models/builds");

class Controller {
	static async showAllMemory(req, res) {
		let page = parseInt(req.query.page);
    let limit = 10;
    const documentsCount = await Memory.findDocumentsCount()
    const howManyPages = Math.ceil(documentsCount / limit)

    if (page <= 0) {
      res
        .status(404)
        .json({ message: "invalid page number, should start with 1" });
    } else {
      let skippedData = (page - 1) * limit;
      Memory.findAll(skippedData, limit)
        .then((data) => {
          res.status(200).json({ data, howManyPages });
        });
    }
	}
	static getAllByType(req, res) {
		const { id } = req.params;
		let page = parseInt(req.query.page);
		let limit = 10;
		if (page < 0 || page === 0)
			res.status(400).json({ message: "invalid page number, should start with 1" });
		Builds.findByPk(id)
			.then((data) => {
				if (!data) return false;
				let skippedData = (page - 1) * limit;
				return Memory.findByType(skippedData, limit, data.motherboard.memory_type);
			})
			.then((data) => {
				if (data) res.status(200).json(data);
				else res.status(400).json({ message: "Data not Found" });
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static showOneMemory(req, res, next) {
		let id = req.params.id;
		Memory.findById(id).then((data) => {
			if (data === null) {
				res.status(404).json({ message: `Data not found` });
			} else {
				res.status(200).json(data);
			}
		});
	}
	static addMemory(req, res, next) {
		let newMemory = {
			name: req.body.name,
			image: req.body.image,
			speed: req.body.speed,
			memory_type: req.body.memory_type,
			price: req.body.price,
			stock: req.body.stock,
		};
		const { validated, errors } = memoryValidation(newMemory);
		if (validated) {
			Memory.create(newMemory).then((data) => {
				res.status(201).json(data.ops[0]);
			});
		} else {
			res.status(400).json(errors);
		}
	}

	static editMemory(req, res, next) {
		let id = req.params.id;
		let editedMemory = {
			name: req.body.name,
			image: req.body.image,
			speed: req.body.speed,
			memory_type: req.body.memory_type,
			price: req.body.price,
			stock: req.body.stock,
		};

		const { validated, errors } = memoryValidation(editedMemory);
		if (validated) {
			Memory.update(id, editedMemory)
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
	static deleteMemory(req, res, next) {
		let id = req.params.id;
		Memory.destroy(id)
			.then(() => {
				res.status(200).json({ message: "succesfully deleted" });
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}
}

module.exports = Controller;
