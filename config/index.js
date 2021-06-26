const { MongoClient } = require("mongodb");
// const uri = "mongodb://localhost:27017";
const uri =
    "mongodb+srv://pietro:iniFieldPasswordUntukMongoDb@cluster0.gc9uw.mongodb.net/partspicker?retryWrites=true&w=majority";

let database = null;
let dbName = null;

if (process.env.NODE_ENV !== "production") {
    dbName = "testing-partspicker";
} else {
    dbName = "partspicker";
}

async function connect() {
    try {
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await client.connect();
        const db = await client.db(dbName);

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
