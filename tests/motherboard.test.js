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
  await deleteAdmin()
});

let newProduct = {
  name: "TESTING",
  image: "TESTING",
  socket: "TESTING",
  memory_type: "TESTING",
  manufacturer: "TESTING",
  form_factor: "TESTING",
  price: 100,
  stock: 100,
};

let errormemoryEmptyInput = {
  name: "",
  image: "TESTING",
  socket: "TESTING",
  memory_type: "TESTING",
  manufacturer: "TESTING",
  form_factor: "TESTING",
  price: 100,
  stock: 100,
};

let errormemoryInputFormat = {
  name: 100,
  image: "TESTING",
  socket: "TESTING",
  memory_type: "TESTING",
  manufacturer: "TESTING",
  form_factor: "TESTING",
  price: 100,
  stock: 100,
};

let newId = null;
describe("Create", () => {
  test("Success Case | should send an object with key: _id, name, image, socket, memory_type, manufacturer, form_factor, price, stock", (done) => {
    request(app)
      .post("/motherboard")
      .set("access_token", access_token)
      .send(newProduct)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("_id", expect.any(String));
        expect(res.body).toHaveProperty("name", expect.any(String));
        expect(res.body).toHaveProperty("image", expect.any(String));
        expect(res.body).toHaveProperty("socket", expect.any(String));
        expect(res.body).toHaveProperty("memory_type", expect.any(String));
        expect(res.body).toHaveProperty("manufacturer", expect.any(String));
        expect(res.body).toHaveProperty("form_factor", expect.any(String));
        expect(res.body).toHaveProperty("price", expect.any(Number));
        expect(res.body).toHaveProperty("stock", expect.any(Number));
        newId = res.body._id;
        done();
      });
  });
  test("Fail Case | Failed because of empty input", (done) => {
    request(app)
      .post("/motherboard")
      .set("access_token", access_token)
      .send(errormemoryEmptyInput)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body).toContain("All Field Required");
        done();
      });
  });
  test("Fail Case | Failed because of wrong input format", (done) => {
    request(app)
      .post("/motherboard")
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

describe("Show all | Success Case", () => {
  test("should send an array of objects with key:  _id, name, image, socket, memory_type, manufacturer, form_factor, price, stock", (done) => {
    request(app)
      .get("/motherboard")
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty("_id", expect.any(String));
        expect(res.body[0]).toHaveProperty("name", expect.any(String));
        expect(res.body[0]).toHaveProperty("image", expect.any(String));
        expect(res.body[0]).toHaveProperty("socket", expect.any(String));
        expect(res.body[0]).toHaveProperty("memory_type", expect.any(String));
        expect(res.body[0]).toHaveProperty("manufacturer", expect.any(String));
        expect(res.body[0]).toHaveProperty("form_factor", expect.any(String));
        expect(res.body[0]).toHaveProperty("price", expect.any(Number));
        expect(res.body[0]).toHaveProperty("stock", expect.any(Number));
        done();
      });
  });
});

describe("Update motherboard", () => {
  test("Success Case | should send an object with message", (done) => {
    request(app)
      .put(`/motherboard/${newId}`)
      .set("access_token", access_token)
      .send({
        name: "TESTING EDIT",
        image: "TESTING",
        socket: "TESTING",
        memory_type: "TESTING",
        manufacturer: "TESTING",
        form_factor: "TESTING",
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
      .put(`/motherboard/${newId}`)
      .set("access_token", access_token)
      .send(errormemoryEmptyInput)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body).toContain("All Field Required");
        done();
      });
  });
  test("Fail Case | Failed because of wrong input format", (done) => {
    request(app)
      .put(`/motherboard/${newId}`)
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

describe("Delete Case | Success motherboard", () => {
  test("should send an object with message", (done) => {
    request(app)
      .delete(`/motherboard/${newId}`)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("succesfully deleted");
        done();
      });
  });
});
