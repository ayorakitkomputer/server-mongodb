const Build = require("../models/builds");
const History = require("../models/history");

class HistoryController {
	static createHistory(req, res) {
		let doc = { user: req.currentUser, createdAt: Date.now() };

		Build.findByPk(req.body.buildId)
			.then((data) => {
				if (!data) throw new Error("Build not found");
				doc["build"] = data;
				return History.create(doc);
			})
			.then((data) => {
				res.status(201)
					.json(
						{
							message: `${data.insertedCount} documents were inserted`,
							id: data.ops[0]
					 	});
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static getHistory(req, res) {
		History.findAll(req.currentUser.id)
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static getOne(req, res) {
		History.findByPk(req.params.id)
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}
}

module.exports = HistoryController;
