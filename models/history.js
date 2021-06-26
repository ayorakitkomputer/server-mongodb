const { getDatabase } = require("../config");
const collectionName = "history";
const { ObjectId } = require("mongodb");

class History {
	static findAll(id) {
		return getDatabase().collection(collectionName).find({ "user.id": id }).toArray();
	}

	static findByPk(id) {
		return getDatabase()
			.collection(collectionName)
			.findOne({ _id: ObjectId(id) });
	}

	static create(data) {
		return getDatabase().collection(collectionName).insertOne(data);
	}
}

module.exports = History;
