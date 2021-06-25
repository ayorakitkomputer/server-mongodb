const { getDatabase } = require("../config/index");
const { ObjectId } = require("mongodb");
const collectionGpu = "case_fans";

class CaseFan {
  static findAll() {
    return getDatabase().collection(collectionGpu).find().toArray();
  }
  static findById(id) {
    return getDatabase()
      .collection(collectionGpu)
      .findOne({ _id: ObjectId(id) });
  }
  static create(payload) {
    return getDatabase().collection(collectionGpu).insertOne(payload);
  }
  static update(filter, updated) {
    return getDatabase()
      .collection(collectionGpu)
      .updateOne({ _id: ObjectId(filter) }, { $set: updated });
  }
  static destroy(id) {
    return getDatabase()
      .collection(collectionGpu)
      .deleteOne({ _id: ObjectId(id) });
  }
}

module.exports = CaseFan;
