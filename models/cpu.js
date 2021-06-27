const { getDatabase } = require('../config')
const { ObjectId } = require('mongodb')
const collectionName = 'cpu'

class Cpu {
  static findAll() {
    return getDatabase().collection(collectionName).find().toArray()
  }

  static findOne(id) {
    const filter = { _id: ObjectId(id) }
    return getDatabase().collection(collectionName).findOne(filter)
  }

  static create(data) {
    return getDatabase().collection(collectionName).insertOne(data)
  }

  static update(id, data) {
    const filter = { _id: ObjectId(id) }
    const newData = {
      $set: {
        manufacturer: data.manufacturer,
        image: data.image,
        name: data.name,
        socket: data.socket,
        igpu: data.igpu,
        tdp: data.tdp,
        price: data.price,
        stock: data.stock
      }
    }
    return getDatabase().collection(collectionName).updateOne(filter, newData)
  }

  static patchFavorite(id, favorite) {
    const filter = { _id: ObjectId(id) }
    const newData = { $set: { favorite } }
    return getDatabase().collection(collectionName).updateOne(filter, newData)
  }

  static destroy(id) {
    const filter = { _id: ObjectId(id) }
    return getDatabase().collection(collectionName).deleteOne(filter)
  }
}

module.exports = Cpu