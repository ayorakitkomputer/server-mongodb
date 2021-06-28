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
  speed: 100,
  memory_type: "TESTING",
  price: 100,
  stock: 100,
};

let errormemoryEmptyInput = {
  name: "",
  image: "TESTING",
  speed: 100,
  memory_type: "TESTING",
  price: 100,
  stock: 100,
};

let errormemoryInputFormat = {
  name: 100,
  image: "TESTING",
  speed: 100,
  memory_type: "TESTING",
  price: 100,
  stock: 100,
};

let newId = null;
describe("Create", () => {
  test("Success memory | should send an object with key: _id, name, image, speed, memory_type, price, stock", (done) => {
    request(app)
      .post("/memory")
      .set("access_token", access_token)
      .send(newProduct)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("_id", expect.any(String));
        expect(res.body).toHaveProperty("name", expect.any(String));
        expect(res.body).toHaveProperty("image", expect.any(String));
        expect(res.body).toHaveProperty("memory_type", expect.any(String));
        expect(res.body).toHaveProperty("speed", expect.any(Number));
        expect(res.body).toHaveProperty("price", expect.any(Number));
        expect(res.body).toHaveProperty("stock", expect.any(Number));
        newId = res.body._id;
        done();
      });
  });
  test("Fail memory | Failed because of empty input", (done) => {
    request(app)
      .post("/memory")
      .set("access_token", access_token)
      .send(errormemoryEmptyInput)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body).toContain("All Field Required");
        done();
      });
  });
  test("Fail memory | Failed because of wrong input format", (done) => {
    request(app)
      .post("/memory")
      .set("access_token", access_token)
      .send(errormemoryInputFormat)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body).toContain("There's an error in your input");
        done();
      });
  });
});

describe("Show all memory | Success memory", () => {
  test("should send an array of objects with key:  _id, name, image, speed, memory_type, price, stock", (done) => {
    request(app)
      .get("/memory")
      .query({ page: "1" })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty("_id", expect.any(String));
        expect(res.body[0]).toHaveProperty("name", expect.any(String));
        expect(res.body[0]).toHaveProperty("image", expect.any(String));
        expect(res.body[0]).toHaveProperty("memory_type", expect.any(String));
        expect(res.body[0]).toHaveProperty("speed", expect.any(Number));
        expect(res.body[0]).toHaveProperty("price", expect.any(Number));
        expect(res.body[0]).toHaveProperty("stock", expect.any(Number));
        done();
      });
  });
  test("Fail Case | should send a message invalid page number", (done) => {
    request(app)
      .get("/memory")
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
  test("Success Case || should send an array of objects with key: _id, name, image, speed, memory_type, price, stock", (done) => {
    request(app)
      .get(`/memory/${newId}`)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("_id", expect.any(String));
        expect(res.body).toHaveProperty("name", expect.any(String));
        expect(res.body).toHaveProperty("image", expect.any(String));
        expect(res.body).toHaveProperty("memory_type", expect.any(String));
        expect(res.body).toHaveProperty("speed", expect.any(Number));
        expect(res.body).toHaveProperty("price", expect.any(Number));
        expect(res.body).toHaveProperty("stock", expect.any(Number));
        done();
      });
  });
  test("Fail Case || should send a message", (done) => {
    request(app)
      .get(`/memory/60d8937939db680d38b923c9`)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(404);
        expect(res.body.message).toContain("Data not found");
        done();
      });
  });
});

describe("Update memory", () => {
  test("Success memory | should send an object with message", (done) => {
    request(app)
      .put(`/memory/${newId}`)
      .set("access_token", access_token)
      .send({
        name: "TESTING EDIT",
        image: "TESTING",
        speed: 100,
        memory_type: "TESTING",
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
  test("Fail memory | Failed because of empty input", (done) => {
    request(app)
      .put(`/memory/${newId}`)
      .set("access_token", access_token)
      .send(errormemoryEmptyInput)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body).toContain("All Field Required");
        done();
      });
  });
  test("Fail memory | Failed because of wrong input format", (done) => {
    request(app)
      .put(`/memory/${newId}`)
      .set("access_token", access_token)
      .send(errormemoryInputFormat)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body).toContain("There's an error in your input");
        done();
      });
  });
});

describe("Delete memory | Success memory", () => {
  test("should send an object with message", (done) => {
    request(app)
      .delete(`/memory/${newId}`)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("succesfully deleted");
        done();
      });
  });
});
