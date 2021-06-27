const { getDatabase } = require("../config");
const { ObjectId } = require("mongodb");
const collectionName = "storages";

class Storage {
  static findAll() {
    return getDatabase().collection(collectionName).find().toArray();
  }

  static findOne(id) {
    const filter = { _id: ObjectId(id) };
    return getDatabase().collection(collectionName).findOne(filter);
  }

  static create(data) {
    return getDatabase().collection(collectionName).insertOne(data);
  }

  static update(id, data) {
    const filter = { _id: ObjectId(id) };
    const newData = {
      $set: {
        name: data.name,
        image: data.image,
        type: data.type,
        capacity: data.capacity,
        price: data.price,
        stock: data.stock,
      },
    };
    return getDatabase().collection(collectionName).updateOne(filter, newData);
  }

  static destroy(id) {
    const filter = { _id: ObjectId(id) };
    return getDatabase().collection(collectionName).deleteOne(filter);
  }
}

module.exports = Storage;
