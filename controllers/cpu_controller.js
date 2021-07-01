const cpuValidator = require("../helpers/cpu_validator");
const Cpu = require("../models/cpu");

class Controller {
  static async getCpu(req, res) {
    let page = parseInt(req.query.page);
    let limit = 10;
    const documentsCount = await Cpu.findDocumentsCount()
    const howManyPages = Math.ceil(documentsCount / limit)

    if (page <= 0) {
      res
        .status(404)
        .json({ message: "invalid page number, should start with 1" });
    } else {
      let skippedData = (page - 1) * limit;
      Cpu.findAll(skippedData, limit)
        .then((data) => {
          res.status(200).json({ data, howManyPages });
        });
    }
  }

  static getOneCpu(req, res) {
    const id = req.params.id;

    Cpu.findOne(id)
      .then((data) => {
        if (data === null) {
          res.status(404).json({ message: `Data not found` });
        } else {
          res.status(200).json(data);
        }
      })
      .catch((err) => {
        // res.status(500).json({ message: err.message });
      });
  }

  static postCpu(req, res) {
    const newCpu = {
      manufacturer: req.body.manufacturer,
      image: req.body.image,
      name: req.body.name,
      socket: req.body.socket,
      igpu: req.body.igpu === 'true' ? true : false,
      tdp: +req.body.tdp,
      price: +req.body.price,
      stock: +req.body.stock,
    };

    const { errors, errorFlag } = cpuValidator(newCpu);

    if (errorFlag) {
      res.status(400).json(errors);
    } else {
      Cpu.create(newCpu).then((data) => {
        res.status(201).json(data.ops[0]);
      });
    }
  }

  static putCpu(req, res) {
    const id = req.params.id;

    const updatedCpu = {
      manufacturer: req.body.manufacturer,
      image: req.body.image,
      name: req.body.name,
      socket: req.body.socket,
      igpu: req.body.igpu === 'true' ? true : false,
      tdp: +req.body.tdp,
      price: +req.body.price,
      stock: +req.body.stock,
    };

    const { errors, errorFlag } = cpuValidator(updatedCpu);

    if (errorFlag) {
      res.status(400).json(errors);
    } else {
      Cpu.update(id, updatedCpu)
        .then((data) => {
          if (data.matchedCount == 0) {
            // res.status(404).json({ message: `Data not Found` });
          } else if (data.matchedCount == 1 && data.modifiedCount == 1) {
            res.status(200).json({
              message: `Succesfully edited the CPU`,
            });
          }
        })
        .catch((err) => {
          // res.status(500).json({ message: err.message });
        });
    }
  }

  static deleteCpu(req, res) {
    const id = req.params.id;

    Cpu.destroy(id)
      .then((data) => {
        if (data.deletedCount == 0) {
          res.status(404).json({ message: `Data not Found` });
        } else if (data.deletedCount == 1) {
          res.status(200).json(`Succesfully deleted the CPU`);
        }
      })
      .catch((err) => {
        // res.status(500).json({ message: err.message });
      });
  }
}

module.exports = Controller;
