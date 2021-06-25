const Memory = require("../models/memory");
const memoryValidation = require("../helpers/memory_validator");

class Controller {
  static showAllMemory(req, res) {
    Memory.findAll()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }
  static showOneMemory(req, res, next) {
    let id = req.params.id;
    Memory.findById(id)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
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
      Memory.create(newMemory)
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
