const CaseFan = require("../models/case_fan");
const caseFanValidation = require("../helpers/case_fan_validator");

class Controller {
  static showAllCaseFan(req, res) {
    CaseFan.findAll()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }
  static showOneCaseFan(req, res, next) {
    let id = req.params.id;
    CaseFan.findById(id)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }
  static addCaseFan(req, res, next) {
    let newCaseFan = {
      name: req.body.name,
      image: req.body.image,
      size: req.body.size,
      price: req.body.price,
      stock: req.body.stock,
    };
    const { validated, errors } = caseFanValidation(newCaseFan);
    if (validated) {
      CaseFan.create(newCaseFan)
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
  static editCaseFan(req, res, next) {
    let id = req.params.id;
    let editedCaseFan = {
      name: req.body.name,
      image: req.body.image,
      size: req.body.size,
      price: req.body.price,
      stock: req.body.stock,
    };

    const { validated, errors } = caseFanValidation(editedCaseFan);
    if (validated) {
      CaseFan.update(id, editedCaseFan)
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
  static deleteCaseFan(req, res, next) {
    let id = req.params.id;
    CaseFan.destroy(id)
      .then(() => {
        res.status(200).json({ message: "succesfully deleted" });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }
}

module.exports = Controller;
