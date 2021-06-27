const Case = require("../models/case");
const caseValidation = require("../helpers/case_validator");

class Controller {
  static showAllCase(req, res) {
    Case.findAll().then((data) => {
      res.status(200).json(data);
    });
  }
  static showOneCase(req, res, next) {
    let id = req.params.id;
    Case.findById(id).then((data) => {
      if (data === null) {
        res.status(404).json({ message: `Data not found` });
      } else {
        res.status(200).json(data);
      }
    });
  }

  static addCase(req, res, next) {
    let newCase = {
      name: req.body.name,
      image: req.body.image,
      form_factor: req.body.form_factor,
      price: req.body.price,
      stock: req.body.stock,
    };
    const { validated, errors } = caseValidation(newCase);
    if (validated) {
      Case.create(newCase).then((data) => {
        res.status(201).json(data.ops[0]);
      });
    } else {
      res.status(400).json(errors);
    }
  }
  static editCase(req, res, next) {
    let id = req.params.id;
    let editedCase = {
      name: req.body.name,
      image: req.body.image,
      form_factor: req.body.form_factor,
      price: req.body.price,
      stock: req.body.stock,
    };

    const { validated, errors } = caseValidation(editedCase);
    if (validated) {
      Case.update(id, editedCase)
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
  static deleteCase(req, res, next) {
    let id = req.params.id;
    Case.destroy(id)
      .then(() => {
        res.status(200).json({ message: "succesfully deleted" });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }
}

module.exports = Controller;
