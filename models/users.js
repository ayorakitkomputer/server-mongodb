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

	static destroy() {
		return getDatabase(collectionName).remove({});
	}
}

module.exports = Users;
