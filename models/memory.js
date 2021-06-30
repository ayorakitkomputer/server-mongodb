const { getDatabase } = require("../config/index");
const { ObjectId } = require("mongodb");
const collectionName = "memories";

class Memory {
	static findAll(page, limit) {
		return getDatabase().collection(collectionName).find().skip(page).limit(limit).toArray();
	}
	static findDocumentsCount() {
    return getDatabase().collection(collectionName).countDocuments()
  }
	static findByType(filter, limit, skip) {
		return getDatabase().collection(collectionName).aggregate([
			{
				$match: {
					memory_type: filter
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
	static findById(id) {
		return getDatabase()
			.collection(collectionName)
			.findOne({ _id: ObjectId(id) });
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

module.exports = Memory;
