const request = require("supertest");
const app = require("../app.js");
const { connect } = require("../config");
const Users = require("../models/users");

let userCustomer = {
  email: "customer@mail.com",
  password: "password",
  address: "Jakarta",
  firstname: "Customer",
  lastname: "PcPartPicker",
  role: "Customer",
};

let allFieldsRequired = {
  email: "",
  password: "password",
  address: "Jakarta",
  firstname: "Customer",
  lastname: "PcPartPicker",
  role: "Customer",
};

let errorInDataType = {
  email: 100,
  password: "password",
  address: "Jakarta",
  firstname: "Customer",
  lastname: "PcPartPicker",
  role: "Customer",
};

let invalidPassword = {
  email: "customer@mail.com",
  password: "password wrong",
  address: "Jakarta",
  firstname: "Customer",
  lastname: "PcPartPicker",
  role: "Customer",
};

beforeAll(async () => {
  await connect();
}, 15000);


afterAll((done) => {
  Users.destroyEmail(userCustomer.email)
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("Register", () => {
  test("Register | Success Case : should send an object with key: id, email, address, firstname, lastname", (done) => {
    request(app)
      .post("/register")
      .send(userCustomer)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id", expect.any(String));
        expect(res.body).toHaveProperty("email", userCustomer.email);
        expect(res.body).toHaveProperty("address", userCustomer.address);
        expect(res.body).toHaveProperty("firstname", userCustomer.firstname);
        expect(res.body).toHaveProperty("lastname", userCustomer.lastname);
        expect(res.body).not.toHaveProperty("password");
        done();
      });
  });
  test("Register | Fail case: should send a message that User has already register before", (done) => {
    request(app)
      .post("/register")
      .send(userCustomer)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toContain("User has already register before");

        done();
      });
  });
});

describe("Login", () => {
  test("Login | Success Case : should send an object with key: access_token", (done) => {
    request(app)
      .post("/login")
      .send(userCustomer)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("access_token", expect.any(String));
        expect(res.body).not.toHaveProperty("password");
        done();
      });
  });
});
