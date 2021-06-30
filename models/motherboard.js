const { getDatabase } = require("../config/index");
const { ObjectId } = require("mongodb");
const collectionName = "motherboards";

class Motherboard {
	static findAll(page, limit) {
		return getDatabase().collection(collectionName).find().skip(page).limit(limit).toArray();
	}
	static findById(id) {
		return getDatabase()
			.collection(collectionName)
			.findOne({ _id: ObjectId(id) });
	}
	static findDocumentsCount() {
    return getDatabase().collection(collectionName).countDocuments()
  }
	static findBySocket(filter, limit, skip) {
		return getDatabase().collection(collectionName).aggregate([
			{
				$match: {
					socket: filter
				}
			},
			{
				$facet: {
					pages: [
						{
							$count: "total"
						}
					],
					data: [
						{
							$skip: skip
						},
						{
							$limit: limit
						}
					]
				}
			}
		]).toArray()
  }
	static create(payload) {
		return getDatabase().collection(collectionName).insertOne(payload);
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

module.exports = Motherboard;
