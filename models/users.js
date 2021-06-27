const { getDatabase } = require("../config");
const { ObjectId } = require("mongodb");
const { encode } = require("../helpers/bcryptjs");
const collectionName = "users";

class Users {
  static create(doc) {
    doc.password = encode(doc.password);
    return getDatabase().collection(collectionName).insertOne(doc);
  }

  static findOne(email) {
    return getDatabase().collection(collectionName).findOne({ email });
  }

  static findByPk(id) {
    return getDatabase()
      .collection(collectionName)
      .findOne({ _id: ObjectId(id) });
  }

<<<<<<< HEAD
	static destroy(id) {
=======
  static destroy(id) {
>>>>>>> 58884c00c837b31160e7266ac1e135c2a4acc3b0
    return getDatabase()
      .collection(collectionName)
      .deleteOne({ _id: ObjectId(id) });
  }
<<<<<<< HEAD

	// jourdy made this
	static destroyEmail(email) {
    return getDatabase()
      .collection(collectionName)
      .deleteOne({ email: email });
  }
=======
  //   static destroy() {
  //     return getDatabase(collectionName).remove({});
  //   }
>>>>>>> 58884c00c837b31160e7266ac1e135c2a4acc3b0
}

module.exports = Users;
