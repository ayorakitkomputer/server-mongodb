const Build = require("../models/builds");
const History = require("../models/history");

class HistoryController {
	static createHistory(req, res) {
		let doc = { user: req.currentUser, createdAt: Date.now(), shipmentStatus: false };

		Build.findByPk(req.body.buildId)
			.then((data) => {
				if (!data) throw new Error("Build not found");
				doc["build"] = data;
				return History.create(doc);
			})
			.then((data) => {
				res.status(201).json({
					message: `${data.insertedCount} documents were inserted`,
					historyId: data.ops[0]._id,
				});
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static getAllHistory(req, res) {
		History.findAllHistory().then((data) => {
			res.status(200).json(data);
		});
	}

	static patchShipment(req, res) {
		const { id } = req.params;
		const doc = { shipmentStatus: req.body.shipmentStatus };
		History.update(doc, id)
			.then((data) => {
				res.status(200).json({ message: `Updated ${data.modifiedCount} document(s)` });
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
