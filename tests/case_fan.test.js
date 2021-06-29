const request = require("supertest");
const app = require("../app.js");
const { connect } = require("../config");
const { createAdmin, deleteAdmin } = require("./helpers/createAdmin");

let access_token = "";

beforeAll(async () => {
  await connect();
  access_token = await createAdmin();
}, 15000);

afterAll(async () => {
  await deleteAdmin();
});

let newProduct = {
  name: "TESTING",
  image: "TESTING",
  size: "TESTING",
  price: 100,
  stock: 100,
};

let errorCaseEmptyInput = {
  name: "",
  image: "TESTING",
  size: "TESTING",
  price: 100,
  stock: 100,
};

let errorCaseInputFormat = {
  name: 100,
  image: "TESTING",
  size: 100,
  price: 100,
  stock: 100,
};

let newId = null;
describe("Create", () => {
  test("Success Case | should send an object with key: _id, name, image, size, price, stock", (done) => {
    request(app)
      .post("/caseFan")
      .set("access_token", access_token)
      .send(newProduct)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("_id", expect.any(String));
        expect(res.body).toHaveProperty("name", expect.any(String));
        expect(res.body).toHaveProperty("size", expect.any(String));
        expect(res.body).toHaveProperty("price", expect.any(Number));
        expect(res.body).toHaveProperty("stock", expect.any(Number));
        newId = res.body._id;
        done();
      });
  });
  test("Fail Case | Have to login first", (done) => {
    request(app)
      .post("/caseFan")
      .send(newProduct)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toContain("Please Login First");
        done();
      });
  });

  test("Fail Case | Failed because of empty input", (done) => {
    request(app)
      .post("/caseFan")
      .set("access_token", access_token)
      .send(errorCaseEmptyInput)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body).toContain("All Field Required");
        done();
      });
  });
  test("Fail Case | Failed because of wrong input format", (done) => {
    request(app)
      .post("/caseFan")
      .set("access_token", access_token)
      .send(errorCaseInputFormat)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body).toContain("There's an error in your input");
        done();
      });
  });
});

describe("Show all Case | Success Case", () => {
  test("Should send an object with keys data: [_id, name, image, size, price, stock] and howManyPages", (done) => {
    request(app)
      .get("/caseFan")
      .query({ page: "1" })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("howManyPages", expect.any(Number));
        expect(res.body.data[0]).toHaveProperty("_id", expect.any(String));
        expect(res.body.data[0]).toHaveProperty("name", expect.any(String));
        expect(res.body.data[0]).toHaveProperty("size", expect.any(String));
        expect(res.body.data[0]).toHaveProperty("price", expect.any(Number));
        expect(res.body.data[0]).toHaveProperty("stock", expect.any(Number));
        done();
      });
  });
  test("Fail Case | should send a message invalid page number", (done) => {
    request(app)
      .get("/caseFan")
      .query({ page: "0" })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(404);
        expect(res.body.message).toContain(
          "invalid page number, should start with 1"
        );
        done();
      });
  });
});

describe("Show One Case ", () => {
  test("Success Case || should send an array of objects with key:  _id, name, image, size, price, stock", (done) => {
    request(app)
      .get(`/caseFan/${newId}`)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("_id", expect.any(String));
        expect(res.body).toHaveProperty("name", expect.any(String));
        expect(res.body).toHaveProperty("size", expect.any(String));
        expect(res.body).toHaveProperty("price", expect.any(Number));
        expect(res.body).toHaveProperty("stock", expect.any(Number));
        done();
      });
  });
  test("Fail Case || should send a message", (done) => {
    request(app)
      .get(`/caseFan/60d8937939db680d38b923c9`)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(404);
        expect(res.body.message).toContain("Data not found");
        done();
      });
  });
});

describe("Update Case", () => {
  test("Success Case | should send an object with message", (done) => {
    request(app)
      .put(`/caseFan/${newId}`)
      .set("access_token", access_token)
      .send({
        name: "TESTING EDIT",
        image: "TESTING EDIT",
        size: "TESTING",
        price: 100,
        stock: 100,
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("sucessfully edited");
        done();
      });
  });
  test("Fail Case | Failed because of empty input", (done) => {
    request(app)
      .put(`/caseFan/${newId}`)
      .set("access_token", access_token)
      .send(errorCaseEmptyInput)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body).toContain("All Field Required");
        done();
      });
  });
  test("Fail Case | Failed because of wrong input format", (done) => {
    request(app)
      .put(`/caseFan/${newId}`)
      .set("access_token", access_token)
      .send(errorCaseInputFormat)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body).toContain("There's an error in your input");
        done();
      });
  });
});

describe("Delete Case | Success Case", () => {
  test("should send an object with message", (done) => {
    request(app)
      .delete(`/caseFan/${newId}`)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("succesfully deleted");
        done();
      });
  });
});
