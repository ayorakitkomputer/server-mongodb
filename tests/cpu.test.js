const request = require("supertest");
const app = require("../app.js");
const { connect } = require("../config");

beforeAll(async () => {
  await connect();
}, 10000);

let newProduct = {
  name: "TESTING ADD #",
  image: "https://images.evga.com/products/gallery/png/08G-P5-3663-KR_LG_1.png",
  manufacturer: "TESTING",
  socket: 'TESTING',
  igpu: false,
  tdp: 999990,
  price: 1300000,
  stock: 5,
};

let errorCaseEmptyInput = {
  name: "",
  image: "https://images.evga.com/products/gallery/png/08G-P5-3663-KR_LG_1.png",
  manufacturer: "TESTING",
  socket: 'TESTING',
  igpu: false,
  tdp: 999990,
  price: 1300000,
  stock: 5,
};

let errorCaseInputFormat = {
  name: "TESTING",
  image: 100,
  manufacturer: "TESTING",
  socket: 'TESTING',
  igpu: false,
  tdp: 999990,
  price: 1300000,
  stock: 5,
};

let newId = null;
describe("Create", () => {
  test("Success Case | should send an object with key: _id, name, image, manufacturer, socket, igpu, tdp, price, stock", (done) => {
    request(app)
      .post("/cpu")
      // .set("access_token", access_token)
      .send(newProduct)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("_id", expect.any(String));
        expect(res.body).toHaveProperty("name", expect.any(String));
        expect(res.body).toHaveProperty("image", expect.any(String));
        expect(res.body).toHaveProperty("manufacturer", expect.any(String));
        expect(res.body).toHaveProperty("socket", expect.any(String));
        expect(res.body).toHaveProperty("igpu", expect.any(Boolean));
        expect(res.body).toHaveProperty("tdp", expect.any(Number));
        expect(res.body).toHaveProperty("price", expect.any(Number));
        expect(res.body).toHaveProperty("stock", expect.any(Number));
        newId = res.body._id;
        done();
      });
  });
  test("Fail Case | Failed because of empty input", (done) => {
    request(app)
      .post("/cpu")
      // .set("access_token", access_token)
      .send(errorCaseEmptyInput)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body).toContain('All fields are required and an input number must not be less than 0');
        done();
      });
  });
  test("Fail Case | Failed because of wrong input format", (done) => {
    request(app)
      .post("/cpu")
      // .set("access_token", access_token)
      .send(errorCaseInputFormat)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body).toContain('There are errors in the input format');
        done();
      });
  });
});

describe("Show all | Success Case", () => {
  test("should send an array of objects with key: _id, name, image, socket, igpu, manufacturer, tdp, price, stock", (done) => {
    request(app)
      .get("/cpu")
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty("_id", expect.any(String));
        expect(res.body[0]).toHaveProperty("name", expect.any(String));
        expect(res.body[0]).toHaveProperty("image", expect.any(String));
        expect(res.body[0]).toHaveProperty("manufacturer", expect.any(String));
        expect(res.body[0]).toHaveProperty("socket", expect.any(String));
        expect(res.body[0]).toHaveProperty("igpu", expect.any(Boolean));
        expect(res.body[0]).toHaveProperty("tdp", expect.any(Number));
        expect(res.body[0]).toHaveProperty("price", expect.any(Number));
        expect(res.body[0]).toHaveProperty("stock", expect.any(Number));
        done();
      });
  });
});

describe("Update Case", () => {
  test("Success Case | should send an object with message", (done) => {
    request(app)
      .put(`/cpu/${newId}`)
      // .set("access_token", access_token)
      .send({
        name: "TESTING EDIT #",
        image:
          "https://hargadunia.com/resources/products/img_uploads/aW1nX05WSURJQV9HZUZvMTE6MzM6MjY.jpg",
        socket: 'TESTING EDIT',
        igpu: true,
        manufacturer: "TESTING EDIT",
        tdp: 111,
        price: 1002000,
        stock: 10101,
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("Succesfully edited the CPU");
        done();
      });
  });
  test("Fail Case | Failed because of empty input", (done) => {
    request(app)
      .put(`/cpu/${newId}`)
      // .set("access_token", access_token)
      .send(errorCaseEmptyInput)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body).toContain('All fields are required and an input number must not be less than 0');
        done();
      });
  });
  test("Fail Case | Failed because of wrong input format", (done) => {
    request(app)
      .put(`/cpu/${newId}`)
      // .set("access_token", access_token)
      .send(errorCaseInputFormat)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body).toContain('There are errors in the input format');
        done();
      });
  });
});

describe("Delete Case | Success Case", () => {
  test("should send an object with message", (done) => {
    request(app)
      .delete(`/cpu/${newId}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body).toContain("Succesfully deleted the CPU");
        done();
      });
  });
});