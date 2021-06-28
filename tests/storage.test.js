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
  name: "TESTING ADD #",
  image: "https://images.evga.com/products/gallery/png/08G-P5-3663-KR_LG_1.png",
  capacity: "TESTING",
  type: "TESTING",
  price: 1300000,
  stock: 5,
};

let errorCaseEmptyInput = {
  name: "",
  image: "https://images.evga.com/products/gallery/png/08G-P5-3663-KR_LG_1.png",
  capacity: "TESTING",
  type: "TESTING",
  price: 1300000,
  stock: 5,
};

let errorCaseInputFormat = {
  name: "TESTING",
  image: 100,
  capacity: "TESTING",
  type: "TESTING",
  price: 1300000,
  stock: 5,
};

let newId = null;
describe("Create", () => {
  test("Success Case | should send an object with key: _id, name, image, capacity, type, price, stock", (done) => {
    request(app)
      .post("/storages")
      .set("access_token", access_token)
      .send(newProduct)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("_id", expect.any(String));
        expect(res.body).toHaveProperty("name", expect.any(String));
        expect(res.body).toHaveProperty("image", expect.any(String));
        expect(res.body).toHaveProperty("type", expect.any(String));
        expect(res.body).toHaveProperty("capacity", expect.any(String));
        expect(res.body).toHaveProperty("price", expect.any(Number));
        expect(res.body).toHaveProperty("stock", expect.any(Number));
        newId = res.body._id;
        done();
      });
  });
  test("Fail Case | Failed because of empty input", (done) => {
    request(app)
      .post("/storages")
      .set("access_token", access_token)
      .send(errorCaseEmptyInput)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toContain(
          "All fields are required and an input number must not be less than 0"
        );
        done();
      });
  });
  test("Fail Case | Failed because of wrong input format", (done) => {
    request(app)
      .post("/storages")
      .set("access_token", access_token)
      .send(errorCaseInputFormat)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toContain(
          "There are errors in the input format"
        );
        done();
      });
  });
});

describe("Show all | Success Case", () => {
  test("should send an array of objects with key: _id, name, image, capacity, type, price, stock", (done) => {
    request(app)
      .get("/storages")
      .query({ page: "1" })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty("_id", expect.any(String));
        expect(res.body[0]).toHaveProperty("name", expect.any(String));
        expect(res.body[0]).toHaveProperty("image", expect.any(String));
        expect(res.body[0]).toHaveProperty("capacity", expect.any(String));
        expect(res.body[0]).toHaveProperty("type", expect.any(String));
        expect(res.body[0]).toHaveProperty("price", expect.any(Number));
        expect(res.body[0]).toHaveProperty("stock", expect.any(Number));
        done();
      });
  });
  test("Fail Case | should send a message invalid page number", (done) => {
    request(app)
      .get("/storages")
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
  test("Success Case || should send an array of objects with key: _id, name, image, capacity, type, price, stock", (done) => {
    request(app)
      .get(`/storages/${newId}`)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("_id", expect.any(String));
        expect(res.body).toHaveProperty("name", expect.any(String));
        expect(res.body).toHaveProperty("image", expect.any(String));
        expect(res.body).toHaveProperty("capacity", expect.any(String));
        expect(res.body).toHaveProperty("type", expect.any(String));
        expect(res.body).toHaveProperty("price", expect.any(Number));
        expect(res.body).toHaveProperty("stock", expect.any(Number));
        done();
      });
  });
  test("Fail Case || should send a message", (done) => {
    request(app)
      .get(`/storages/60d8937939db680d38b923c9`)
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
      .put(`/storages/${newId}`)
      .set("access_token", access_token)
      .send({
        name: "TESTING EDIT #",
        image:
          "https://hargadunia.com/resources/products/img_uploads/aW1nX05WSURJQV9HZUZvMTE6MzM6MjY.jpg",
        type: "TESTING EDIT",
        capacity: "TESTING EDIT",
        price: 1002000,
        stock: 10101,
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("Succesfully edited the Storage");
        done();
      });
  });
  test("Fail Case | Failed because of empty input", (done) => {
    request(app)
      .put(`/storages/${newId}`)
      .set("access_token", access_token)
      .send(errorCaseEmptyInput)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toContain(
          "All fields are required and an input number must not be less than 0"
        );
        done();
      });
  });
  test("Fail Case | Failed because of wrong input format", (done) => {
    request(app)
      .put(`/storages/${newId}`)
      .set("access_token", access_token)
      .send(errorCaseInputFormat)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toContain(
          "There are errors in the input format"
        );
        done();
      });
  });
});

describe("Delete Case | Success Case", () => {
  test("should send an object with message", (done) => {
    request(app)
      .delete(`/storages/${newId}`)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("Succesfully deleted the Storage");
        done();
      });
  });
});
