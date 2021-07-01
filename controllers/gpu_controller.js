const Gpu = require("../models/gpu");
const gpuValidation = require("../helpers/gpu_validator");

class Controller {
  static async showAllGpu(req, res) {
    let page = parseInt(req.query.page);
    let limit = 10;
    const documentsCount = await Gpu.findDocumentsCount()
    const howManyPages = Math.ceil(documentsCount / limit)

    if (page <= 0) {
      res
        .status(404)
        .json({ message: "invalid page number, should start with 1" });
    } else {
      let skippedData = (page - 1) * limit;
      Gpu.findAll(skippedData, limit)
        .then((data) => {
          res.status(200).json({ data, howManyPages });
        });
    }
  }
  static showOneGpu(req, res, next) {
    let id = req.params.id;
    Gpu.findById(id).then((data) => {
      if (data === null) {
        res.status(404).json({ message: `Data not found` });
      } else {
        res.status(200).json(data);
      }
    });
  }
  static addGpu(req, res, next) {
    let newGpu = {
      name: req.body.name,
      image: req.body.image,
      manufacturer: req.body.manufacturer,
      tdp: +req.body.tdp,
      price: +req.body.price,
      stock: +req.body.stock,
    };
    const { validated, errors } = gpuValidation(newGpu);
    if (validated) {
      Gpu.create(newGpu).then((data) => {
        res.status(201).json(data.ops[0]);
      });
    } else {
      res.status(400).json(errors);
    }
  }
  static editGpu(req, res, next) {
    let id = req.params.id;
    let editedGpu = {
      name: req.body.name,
      image: req.body.image,
      manufacturer: req.body.manufacturer,
      tdp: +req.body.tdp,
      price: +req.body.price,
      stock: +req.body.stock,
    };

    const { validated, errors } = gpuValidation(editedGpu);
    if (validated) {
      Gpu.update(id, editedGpu)
        .then(() => {
          res.status(200).json({ message: "sucessfully edited" });
        })
        .catch((err) => {
          // res.status(500).json({ message: err.message });
        });
    } else {
      res.status(400).json(errors);
    }
  }
  static deleteGpu(req, res, next) {
    let id = req.params.id;
    Gpu.destroy(id)
      .then(() => {
        res.status(200).json({ message: "succesfully deleted" });
      })
      .catch((err) => {
        // res.status(500).json({ message: err.message });
      });
  }
}

module.exports = Controller;
