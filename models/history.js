const { getDatabase } = require("../config");
const collectionName = "history";
const { ObjectId } = require("mongodb");

class History {
	static findAll(id) {
		return getDatabase().collection(collectionName).find({ "user.id": id }).toArray();
	}

	static findAllHistory() {
		return getDatabase().collection(collectionName).find().toArray();
	}

	static findByPk(id) {
		return getDatabase()
			.collection(collectionName)
			.findOne({ _id: ObjectId(id) });
	}

	static create(data) {
		return getDatabase().collection(collectionName).insertOne(data);
	}

	static update(updateDoc, id) {
		return getDatabase()
			.collection(collectionName)
			.updateOne({ _id: ObjectId(id) }, { $set: updateDoc });
	}
}

module.exports = History;
