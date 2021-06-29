const request = require("supertest");
const app = require("../app.js");
const { connect } = require("../config");
const Users = require("../models/users");
const { sign } = require("../helpers/jwt");

let access_token;
let email;

let xenditCustomer = {
  email: "xendit@mail.com",
  password: "password",
  address: "Jakarta",
  firstname: "Xendit Customer 2",
  lastname: "PcPartPicker",
  role: "Customer",
};

beforeAll(async () => {
  await connect();

  const user = await Users.create(xenditCustomer);

  let newUser = {
    id: user.ops[0]._id,
    email: user.ops[0].email,
    role: user.ops[0].role,
  };

  email = newUser.email;
  access_token = sign(newUser);
}, 15000);

afterAll(() => {
  Users.destroyEmail(xenditCustomer.email);
});

describe("Create || Success Case", () => {
  test("Should create a new invoice", (done) => {
    request(app)
      .post("/payment/invoice")
      .send({ amount: 1000000 })
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) return done(err);
        
        expect(res.status).toBe(201);
        expect(res.body).toStrictEqual(expect.any(Object));
        expect(res.body).toHaveProperty("available_banks", expect.any(Array));
        expect(res.body).toHaveProperty("available_retail_outlets", expect.any(Array));
        expect(res.body).toHaveProperty("available_ewallets", expect.any(Array));

        done();
      });
  });
});

describe("Fail Case", () => {
  test("Fail Case : if the amount is less than equel 0 or there is any invalid format of data sent. It should return an error message", (done) => {
    request(app)
    .post("/payment/invoice")
    .send({ amount: 0 })
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).toBe(500);
        expect(res.body.message).toContain('There was an error with the format submitted to the server.');

        done();
      });
  });
});