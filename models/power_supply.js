const { getDatabase } = require("../config");
const { ObjectId } = require("mongodb");
const collectionName = "power_supplies";

class Power_Supply {
	static findAll(page, limit) {
		return getDatabase().collection(collectionName).find().skip(page).limit(limit).toArray();
	}
	
	static findDocumentsCount() {
    return getDatabase().collection(collectionName).countDocuments()
  }

	static findAllByWatt(page, limit, watt) {
		return getDatabase()
			.collection(collectionName)
			.find({ wattage: { $gt: watt } })
			.skip(page)
			.limit(limit)
			.toArray();
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
				efficiency_rating: data.efficiency_rating,
				wattage: data.wattage,
				price: data.price,
				stock: data.stock,
				image: data.image,
			},
		};
		return getDatabase().collection(collectionName).updateOne(filter, newData);
	}

	static destroy(id) {
		const filter = { _id: ObjectId(id) };
		return getDatabase().collection(collectionName).deleteOne(filter);
	}
}

module.exports = Power_Supply;
