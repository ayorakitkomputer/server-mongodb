const Power_supply_Validator = require('../helpers/Power_supply_validator');
const Power_supply = require('../models/Power_supply')

class Controller {
  static getPower_supply(req, res, next) {
    Power_supply.findAll()
      .then((data) => {
        res.status(200).json(data)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  static getOnePower_supply(req, res, next) {
    const id = req.params.id

    Power_supply.findOne(id)
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

  static postPower_supply(req, res, next) {
    const newPower_supply = {
      image: req.body.image,
      name: req.body.name,
      efficiency_rating: req.body.efficiency_rating,
      wattage: req.body.wattage,
      price: req.body.price,
      stock: req.body.stock
    }

    const { errors, errorFlag } = Power_supply_Validator(newPower_supply)

    if (errorFlag) {
      res.status(400).json({ message: errors })
    }
    else {
      Power_supply.create(newPower_supply)
        .then(() => {
          res.status(201).json({ message: `Succesfully created Power Supply: ${newPower_supply.name}`})
        })
        .catch((err) => {
          res.status(500).json({ message: 'Server Error'})
        })
    }
  }

  static putPower_supply(req, res, next) {
    const id = req.params.id

    const updatedPower_supply = {
      image: req.body.image,
      name: req.body.name,
      efficiency_rating: req.body.efficiency_rating,
      wattage: req.body.wattage,
      price: req.body.price,
      stock: req.body.stock
    }

    const { errors, errorFlag } = Power_supply_Validator(updatedPower_supply)

    if (errorFlag) {
      res.status(400).json({ message: errors })
    }
    else {
      Power_supply.update(id, updatedPower_supply)
        .then((data) => {
          if (data.matchedCount == 0) {
            res.status(404).json({ message: `Data not Found`})
          }
          else if (data.matchedCount == 1 && data.modifiedCount == 0) {
            res.status(200).json({ message: `The updated data is the same, so no changes are made`})
          }
          else if (data.matchedCount == 1 && data.modifiedCount == 1) {
            res.status(200).json({ message: `Succesfully edited the Power Supply`})
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: 'Server Error'})
        })
    }
  }

  static deletePower_supply(req, res, next) {
    const id = req.params.id

    Power_supply.destroy(id)
      .then((data) => {
        console.log(data);
        if (data.deletedCount == 0) {
          res.status(404).json({ message: `Data not Found`})
        }
        else if (data.deletedCount == 1) {
          res.status(200).json({ message: `Succesfully deleted the Power Supply`})
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'Server Error'})
      })
  }
}

module.exports = Controller