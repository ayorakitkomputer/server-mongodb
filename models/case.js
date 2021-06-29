const { getDatabase } = require("../config/index");
const { ObjectId } = require("mongodb");
const collectionName = "cases";

class Case {
	static findAll(page, limit) {
		return getDatabase().collection(collectionName).find().skip(page).limit(limit).toArray();
	}
	static findById(id) {
		return getDatabase()
			.collection(collectionName)
			.findOne({ _id: ObjectId(id) });
	}
	static create(payload) {
		return getDatabase().collection(collectionName).insertOne(payload);
	}
	static findByFormFactor(page, limit, form_factor) {
		return getDatabase()
			.collection(collectionName)
			.find({ form_factor })
			.skip(page)
			.limit(limit)
			.toArray();
	}
	static update(filter, updated) {
		return getDatabase()
			.collection(collectionName)
			.updateOne({ _id: ObjectId(filter) }, { $set: updated });
	}
	static destroy(id) {
		return getDatabase()
			.collection(collectionName)
			.deleteOne({ _id: ObjectId(id) });
	}
}

module.exports = Case;
