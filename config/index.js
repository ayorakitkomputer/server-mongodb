const { MongoClient } = require("mongodb");
// const uri = "mongodb://localhost:27017";
const uri =
	"mongodb+srv://pietro:iniFieldPasswordUntukMongoDb@cluster0.gc9uw.mongodb.net/partspicker?retryWrites=true&w=majority";

let database = null;
let client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function connect() {
	try {
		await client.connect();
		const db = await client.db("testing-partspicker");

		database = db;
		return db;
	} catch (error) {
		console.log(error);
	}
}

function getDatabase() {
	return database;
}

module.exports = { connect, getDatabase };
