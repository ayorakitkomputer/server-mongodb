const monitorValidator = require("../helpers/monitor_validator");
const Monitor = require("../models/monitor");

class Controller {
  static async getMonitor(req, res) {
    let page = parseInt(req.query.page);
    let limit = 10;
    const documentsCount = await Monitor.findDocumentsCount()
    const howManyPages = Math.ceil(documentsCount / limit)

    if (page <= 0) {
      res
        .status(404)
        .json({ message: "invalid page number, should start with 1" });
    } else {
      let skippedData = (page - 1) * limit;
      Monitor.findAll(skippedData, limit)
        .then((data) => {
          res.status(200).json({ data, howManyPages });
        });
    }
  }

  static getOneMonitor(req, res) {
    const id = req.params.id;

    Monitor.findOne(id).then((data) => {
      if (data === null) {
        res.status(404).json({ message: `Data not found` });
      } else {
        res.status(200).json(data);
      }
    });
  }

  static postMonitor(req, res) {
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
      Monitor.create(newMonitor).then((data) => {
        res.status(201).json(data.ops[0]);
      });
    }
  }

  static putMonitor(req, res) {
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
          } else if (data.matchedCount == 1 && data.modifiedCount == 1) {
            res.status(200).json({ message: `Succesfully edited the Monitor` });
          }
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    }
  }

  static deleteMonitor(req, res) {
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
      });
  }
}

module.exports = Controller;
