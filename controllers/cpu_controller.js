const cpuValidator = require('../helpers/cpu_validator');
const Cpu = require('../models/cpu')

class Controller {
  static getCpu(req, res, next) {
    Cpu.findAll()
      .then((data) => {
        res.status(200).json(data)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  static getOneCpu(req, res, next) {
    const id = req.params.id

    Cpu.findOne(id)
      .then((data) => {
        if (data === null) {
          res.status(404).json({ message: `Data not found`})
        }
        else {
          res.status(200).json(data)
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  static postCpu(req, res, next) {
    const newCpu = {
      manufacturer: req.body.manufacturer,
      image: req.body.image,
      name: req.body.name,
      socket: req.body.socket,
      igpu: req.body.igpu,
      tdp: req.body.tdp,
      price: req.body.price,
      stock: req.body.stock
    }

    const { errors, errorFlag } = cpuValidator(newCpu)

    if (errorFlag) {
      res.status(400).json({ message: errors })
    }
    else {
      Cpu.create(newCpu)
        .then(() => {
          res.status(201).json({ message: `Succesfully created CPU: ${newCpu.manufacturer} ${newCpu.name}`})
        })
        .catch((err) => {
          res.status(500).json({ message: 'Server Error'})
        })
    }
  }

  static putCpu(req, res, next) {
    const id = req.params.id

    const updatedCpu = {
      manufacturer: req.body.manufacturer,
      image: req.body.image,
      name: req.body.name,
      socket: req.body.socket,
      igpu: req.body.igpu,
      tdp: req.body.tdp,
      price: req.body.price,
      stock: req.body.stock
    }

    const { errors, errorFlag } = cpuValidator(updatedCpu)

    if (errorFlag) {
      res.status(400).json({ message: errors })
    }
    else {
      Cpu.update(id, updatedCpu)
        .then((data) => {
          if (data.matchedCount == 0) {
            res.status(404).json({ message: `Data not Found`})
          }
          else if (data.matchedCount == 1 && data.modifiedCount == 0) {
            res.status(200).json({ message: `The updated data is the same, so no changes are made`})
          }
          else if (data.matchedCount == 1 && data.modifiedCount == 1) {
            res.status(200).json({ message: `Succesfully edited the CPU`})
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: 'Server Error'})
        })
    }
  }

  static deleteCpu(req, res, next) {
    const id = req.params.id

    Cpu.destroy(id)
      .then((data) => {
        console.log(data);
        if (data.deletedCount == 0) {
          res.status(404).json({ message: `Data not Found`})
        }
        else if (data.deletedCount == 1) {
          res.status(200).json({ message: `Succesfully deleted the CPU`})
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'Server Error'})
      })
  }
}

module.exports = Controller