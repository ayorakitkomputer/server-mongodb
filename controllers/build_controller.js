const Builds = require("../models/builds");
const Cpu = require("../models/cpu");
const Motherboard = require("../models/motherboard");
const Memory = require("../models/memory");
const Storage = require("../models/storage");
const Gpu = require("../models/gpu");
const Case = require("../models/case");
const PowerSupply = require("../models/power_supply");
const Monitor = require("../models/monitor");

class BuildController {
	static addBuild(req, res) {
		Cpu.findOne(req.body.cpuId)
			.then((cpu) => {
				if (!cpu) return false;
				let doc = {
					cpu,
					user: req.currentUser,
				};
				return Builds.create(doc);
			})
			.then((data) => {
				if (data) {
					res.status(200).json({ message: `${data.insertedCount} documents were inserted` });
				} else {
					res.status(400).json({ message: `CPU not found` });
				}
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static patchCpu(req, res) {
		const buildId = req.params.id;
		let buildData;

		Builds.findByPk(buildId)
			.then((data) => {
				if (!data) throw new Error("Build not found");
				buildData = data;
				return Cpu.findOne(req.body.cpuId);
			})
			.then((cpu) => {
				if (!cpu) throw new Error("CPU not found");
				let doc = { cpu };
				return Builds.update(doc, buildId);
			})
			.then((data) => {
				res.status(200).json({ message: `Updated ${data.modifiedCount} document(s)` });
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static patchMotherboard(req, res) {
		const buildId = req.params.id;
		let buildData;

		Builds.findByPk(buildId)
			.then((data) => {
				if (!data) throw new Error("Build not found");
				buildData = data;
				return Motherboard.findById(req.body.motherboardId);
			})
			.then((motherboard) => {
				if (!motherboard) throw new Error("Motherboard not found");
				else if (motherboard.socket === buildData.cpu.socket) {
					let doc = { motherboard };
					return Builds.update(doc, buildId);
				} else throw new Error("Motherboard is not compatible");
			})
			.then((data) => {
				res.status(200).json({ message: `Updated ${data.modifiedCount} document(s)` });
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static patchMemory(req, res) {
		const buildId = req.params.id;
		let buildData;

		Builds.findByPk(buildId)
			.then((data) => {
				if (!data) throw new Error("Build not found");
				buildData = data;
				return Memory.findById(req.body.memoryId);
			})
			.then((memory) => {
				if (!memory) throw new Error("Memory not found");
				else if (memory.memory_type === buildData.motherboard.memory_type) {
					let doc = { memory };
					return Builds.update(doc, buildId);
				} else throw new Error("Memory is not compatible");
			})
			.then((data) => {
				res.status(200).json({ message: `Updated ${data.modifiedCount} document(s)` });
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static patchStorage(req, res) {
		const buildId = req.params.id;
		const { storageIds } = req.body;
		let buildData;
		let promises = [];

		Builds.findByPk(buildId)
			.then((data) => {
				if (!data) throw new Error("Build not found");
				buildData = data;
				if (Array.isArray(storageIds)) {
					buildData["storage"] = [];

					storageIds.forEach((storageId) => {
						promises.push(
							Storage.findOne(storageId)
								.then((storage) => {
									if (!storage) throw new Error("Storage not found");
									buildData["storage"].push(storage);
								})
								.catch((err) => {
									res.status(500).json({ message: err.message });
								})
						);
					});

					return Promise.all(promises);
				} else {
					throw new Error("Storages must be an Array");
				}
			})
			.then(() => {
				return Builds.update({ storage: buildData.storage }, buildId);
			})
			.then((data) => {
				res.status(200).json({ message: `Updated ${data.modifiedCount} document(s)` });
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static patchGpu(req, res) {
		const buildId = req.params.id;
		const { gpuIds } = req.body;
		let buildData;
		let promises = [];

		Builds.findByPk(buildId)
			.then((data) => {
				if (!data) throw new Error("Build not found");
				buildData = data;
				if (Array.isArray(gpuIds)) {
					if (gpuIds.length > 3) throw new Error("GPU cannot more than 3");
					buildData["gpu"] = [];

					gpuIds.forEach((gpuId) => {
						promises.push(
							Gpu.findById(gpuId)
								.then((gpu) => {
									if (!gpu) throw new Error("GPU not found");
									buildData["gpu"].push(gpu);
								})
								.catch((err) => {
									res.status(500).json({ message: err.message });
								})
						);
					});

					return Promise.all(promises);
				} else {
					throw new Error("GPUs must be an Array");
				}
			})
			.then(() => {
				return Builds.update({ gpu: buildData.gpu }, buildId);
			})
			.then((data) => {
				res.status(200).json({ message: `Updated ${data.modifiedCount} document(s)` });
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static patchCase(req, res) {
		const buildId = req.params.id;
		let buildData;

		Builds.findByPk(buildId)
			.then((data) => {
				if (!data) throw new Error("Build not found");
				buildData = data;
				return Case.findById(req.body.caseId);
			})
			.then((caseData) => {
				if (!caseData) throw new Error("Case not found");
				else if (caseData.form_factor === buildData.motherboard.form_factor) {
					let doc = { case: caseData };
					return Builds.update(doc, buildId);
				} else throw new Error("Case is not compatible");
			})
			.then((data) => {
				res.status(200).json({ message: `Updated ${data.modifiedCount} document(s)` });
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static patchPowerSupply(req, res) {
		const buildId = req.params.id;
		let buildData;

		Builds.findByPk(buildId)
			.then((data) => {
				if (!data) throw new Error("Build not found");
				buildData = data;
				return PowerSupply.findOne(req.body.powerSupplyId);
			})
			.then((powerSupply) => {
				if (!powerSupply) throw new Error("Power supply not found");

				let currentWattage = 0;

				currentWattage += buildData.cpu.tdp;

				buildData.gpu.forEach((gpuData) => {
					currentWattage += gpuData.tdp;
				});

				if (powerSupply.wattage >= currentWattage) {
					let doc = { powerSupply };
					return Builds.update(doc, buildId);
				} else throw new Error("Need power supply with more wattage");
			})
			.then((data) => {
				res.status(200).json({ message: `Updated ${data.modifiedCount} document(s)` });
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static patchMonitor(req, res) {
		const buildId = req.params.id;
		const { monitorIds } = req.body;
		let buildData;
		let promises = [];

		Builds.findByPk(buildId)
			.then((data) => {
				if (!data) throw new Error("Build not found");
				buildData = data;
				if (Array.isArray(monitorIds)) {
					buildData["monitor"] = [];

					monitorIds.forEach((monitorId) => {
						promises.push(
							Monitor.findOne(monitorId)
								.then((monitor) => {
									if (!monitor) throw new Error("Monitor not found");
									buildData["monitor"].push(monitor);
								})
								.catch((err) => {
									res.status(500).json({ message: err.message });
								})
						);
					});

					return Promise.all(promises);
				} else {
					throw new Error("Monitors must be an Array");
				}
			})
			.then(() => {
				return Builds.update({ monitor: buildData.monitor }, buildId);
			})
			.then((data) => {
				res.status(200).json({ message: `Updated ${data.modifiedCount} document(s)` });
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static getAllByUserId(req, res) {
		const UserId = req.currentUser.id;
		Builds.findByUser(UserId)
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static getById(req, res) {
		const { id } = req.params;
		Builds.findByPk(id)
			.then((data) => {
				res.status(200).json(data);
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
