const { MongoClient } = require("mongodb");
const uri =
	"mongodb+srv://pietro:iniFieldPasswordUntukMongoDb@cluster0.gc9uw.mongodb.net/partspicker?retryWrites=true&w=majority";
const mongoDbName = "testing-partspicker";
const collection = db.collection("users");

let userData = {
	email: "tes@tes.com",
	password: "tes",
	address: "alamat",
	firstname: "tesawal",
	lastname: "tesakhir",
	role: "Customer",
};

beforeAll(async () => {
	connection = await MongoClient.connect(uri, {
		useNewUrlParser: true,
	});
	db = await connection.db(mongoDbName);
});

afterAll(async () => {
	await connection.close();
	await db.close();
});

describe("Register", () => {
	test("Success", async () => {
		await collection.insertOne(userData);
		const insertedData = await collection.findOne({ email: userData.email });
		expect(insertedData).toEqual(userData);
	});

	test("Failed | Email already registered", async () => {
		const collection = db.collection("users");

		const insertedData = collection.insertOne(userData);

		expect(insertedData).toEqual(userData);
		request(app)
			.post("/register")
			.send(userData)
			.end((err, res) => {
				if (err) return done(err);
				// expect(res.status).toBe(400);
				expect(res.body).toEqual(expect.any(Object));
				expect(res.body).toHaveProperty("message", `User has already register before`);
				done();
			});
	});

	test("Failed | Email or password is empty", (done) => {
		userData.password = "";
		request(app)
			.post("/register")
			.send(userData)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.status).toBe(400);
				expect(res.body).toEqual(expect.any(Object));
				expect(res.body).toHaveProperty("message", `All fields required`);
				done();
			});
	});

	test("Failed | Wrong data types", (done) => {
		userData.password = 123;
		request(app)
			.post("/register")
			.send(userData)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.status).toBe(400);
				expect(res.body).toEqual(expect.any(Object));
				expect(res.body).toHaveProperty("message", `Oops there seems an error on your data types`);
				done();
			});
	});
});
