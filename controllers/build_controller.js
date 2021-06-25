const Builds = require("../models/builds");

class BuildController {
	static addBuild(req, res) {
		let doc = {
			cpu: req.body.cpuId,
			user: req.current_user,
		};

		Builds.create(doc)
			.then((data) => {
				res.status(200).json({ message: `${data.insertedCount} documents were inserted` });
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static getAllByUserId(req, res) {
		const UserId = req.currentUser.id;
		Builds.findWhere(UserId)
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static patchMotherboard(req, res) {
		const { id } = req.params;

		Builds.findByPk(id).then((data) => {});

		let doc = {
			cpu: req.body.cpu ? req.body.cpu : null,
			motherboard: null,
			memory: null,
			storage: [],
			gpu: [],
			case: null,
			power_supply: null,
			case_fan: null,
			Monitor: [],
		};

		Builds.update(doc, id)
			.then((data) => {
				res.status(200).json({ message: `${data.insertedCount} documents were inserted` });
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static deleteBuild(req, res) {
		const { id } = req.params;
		Builds.destroy(id)
			.then((data) => {
				if (data.deletedCount === 1) {
					res.status(200).json({ message: `Successfully deleted one document.` });
				} else {
					res.status(200).json({ message: `No documents matched the query. Deleted 0 documents.` });
				}
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}
}

module.exports = BuildController;
