const request = require("supertest");
const app = require("../app");
const Gpu = require("../models/gpu");
// const jwt = require("jsonwebtoken");

//after done, change description name and all the little details
//then make validation

let newGpu = {
  name: "TESTING",
  image:
    "https://hargadunia.com/resources/products/img_uploads/aW1nX05WSURJQV9HZUZvMTE6MzM6MjY.jpg",
  manufacturer: "TESTING",
  tdp: 111,
  price: 1002000,
  stock: 10101,
};

beforeAll((done) => {
  Gpu.create(newGpu)
    .then((data) => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

// afterAll((done) => {
//   Gpu.destroy({ truncate: true, restartIdentity: true })
//     .then(() => {
//       done();
//     })
//     .catch((err) => {
//       done(err);
//     });
// });

describe("Create gpu", () => {
  test("Success Case | should send an object with key: _id, name, image, manufacturere, tdp, price, stock", (done) => {
    request(app)
      .post("/gpu")
      // .set("access_token", access_token)
      .send(newGpu)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("_id", expect.any(Number));
        expect(res.body).toHaveProperty("name", expect.any(String));
        expect(res.body).toHaveProperty("image", expect.any(String));
        expect(res.body).toHaveProperty("manufacturer", expect.any(String));
        expect(res.body).toHaveProperty("tdp", expect.any(Number));
        expect(res.body).toHaveProperty("price", expect.any(Number));
        expect(res.body).toHaveProperty("stock", expect.any(Number));
        done();
      });
  });
});

describe("Show all Gpu | Success Case", () => {
  test("should send an array of objects with key: _id, name, image, manufacturere, tdp, price, stock", (done) => {
    request(app)
      .get("/gpu")
      // .set("access_token", access_token)
      .end((err, res) => {
        if (err) return done(err);
        // expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty("_id", expect.any(Number));
        expect(res.body[0]).toHaveProperty("name", expect.any(String));
        expect(res.body[0]).toHaveProperty("image", expect.any(String));
        expect(res.body[0]).toHaveProperty("manufacturer", expect.any(String));
        expect(res.body[0]).toHaveProperty("tdp", expect.any(Number));
        expect(res.body[0]).toHaveProperty("price", expect.any(Number));
        expect(res.body[0]).toHaveProperty("stock", expect.any(Number));
        done();
      });
  });
});

describe("Update Gpu", () => {
  test("Success Case | should send an object with key: _id, name, image, manufacturere, tdp, price, stock", (done) => {
    request(app)
      .put("/gpu/1")
      // .set("access_token", access_token)
      .send({
        name: "TESTING EDIT",
        image:
          "https://hargadunia.com/resources/products/img_uploads/aW1nX05WSURJQV9HZUZvMTE6MzM6MjY.jpg",
        manufacturer: "TESTING EDIT",
        tdp: 111,
        price: 1002000,
        stock: 10101,
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("sucessfully edited");
        done();
      });
  });
});

describe("Delete Gpu | Success Case", () => {
  test("should send an object with key: _id, name, image, manufacturere, tdp, price, stock", (done) => {
    request(app)
      .delete("/gpu/1")
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("succesfully deleted");
        done();
      });
  });
});
