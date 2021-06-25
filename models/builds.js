const { getDatabase } = require("../config");
const { ObjectId } = require("mongodb");
const collectionName = "builds";

class Builds {
	static create(doc) {
		return getDatabase().collection(collectionName).insertOne(doc);
	}

	static findByUser(UserId) {
		return getDatabase().collection(collectionName).find({ "user.id": UserId }).toArray();
	}

	static findByPk(id) {
		return getDatabase()
			.collection(collectionName)
			.findOne({ _id: ObjectId(id) });
	}

	static update(updateDoc, id) {
		return getDatabase()
			.collection(collectionName)
			.updateOne({ _id: ObjectId(id) }, { $set: updateDoc });
	}

	static destroy(id) {
		return getDatabase()
			.collection(collectionName)
			.deleteOne({ _id: ObjectId(id) });
	}
}

module.exports = Builds;
