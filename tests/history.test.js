const request = require("supertest");
const app = require("../app.js");
const { connect } = require("../config");
const Users = require("../models/users");
const { sign } = require("../helpers/jwt");

let access_token;
let email;
let userId;
let historyId;
let unauthorizedToken;

let historyCustomer = {
  email: "history@mail.com",
  password: "password",
  address: "Jakarta",
  firstname: "Customer",
  lastname: "PcPartPicker",
  role: "Customer",
};

let userCustomerTwo = {
  email: "build2@mail.com",
  password: "password",
  address: "Jakarta",
  firstname: "2",
  lastname: "PcPartPicker",
  role: "Customer",
};

const correctBuildId = {
  buildId: "60d8912559c5950ba524f8ac",
};

const wrongBuildId = {
  buildId: "60d879ae75210303822bb7d6",
};

beforeAll(async () => {
  await connect();

  const user = await Users.create(historyCustomer);
  let user2 = await Users.create(userCustomerTwo);

  let newUser = {
    id: user.ops[0]._id,
    email: user.ops[0].email,
    role: user.ops[0].role,
  };

  let newUser2 = {
    id: user2.ops[0]._id,
    email: user2.ops[0].email,
    role: user2.ops[0].role,
  };

  userId = newUser.id;
  email = newUser.email;
  access_token = sign(newUser);
  unauthorizedToken = sign(newUser2);

  // buat shipmetn jd false spy g error di test bawh
}, 15000);

afterAll(() => {
  Users.destroyEmail(historyCustomer.email);
});

describe("Create", () => {
  test("Create | Success Case : should create a new History", (done) => {
    request(app)
      .post("/history")
      .send(correctBuildId)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("message", expect.any(String));

        historyId = res.body.historyId;
        done();
      });
  });
});

describe("Create Fail case", () => {
  test("Fail case | Failed because Build is not found", (done) => {
    request(app)
      .post("/history")
      .send(wrongBuildId)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).toBe(500);
        expect(res.body.message).toContain("Build not found");

        done();
      });
  });
});

describe("Show History", () => {
  test("Show all | Success Case : should send all of the Histories", (done) => {
    request(app)
      .get("/history")
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).toBe(200);
        expect(res.body[0].build).toHaveProperty("cpu", expect.any(Object));
        expect(res.body[0].build).toHaveProperty("user", expect.any(Object));
        expect(res.body[0].build).toHaveProperty(
          "motherboard",
          expect.any(Object)
        );
        expect(res.body[0].build).toHaveProperty("memory", expect.any(Object));
        expect(res.body[0].build).toHaveProperty("storage", expect.any(Array));
        expect(res.body[0].build).toHaveProperty("gpu", expect.any(Array));
        expect(res.body[0].build).toHaveProperty("case", expect.any(Object));
        expect(res.body[0].build).toHaveProperty(
          "powerSupply",
          expect.any(Object)
        );
        done();
      });
  });
  test("Show all | Success Case : should send all of the History Transactions", (done) => {
    request(app)
      .get("/history/transactions")
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).toBe(200);
        expect(res.body[0].build).toHaveProperty("cpu", expect.any(Object));
        expect(res.body[0].build).toHaveProperty("user", expect.any(Object));
        expect(res.body[0].build).toHaveProperty(
          "motherboard",
          expect.any(Object)
        );
        expect(res.body).toEqual(expect.any(Array))
        expect(res.body[0]).toEqual(expect.any(Object))
        expect(res.body[0]).toHaveProperty("_id", expect.any(String));
        expect(res.body[0]).toHaveProperty("user", expect.any(Object));
        expect(res.body[0].user).toHaveProperty("id", expect.any(String));
        expect(res.body[0].user).toHaveProperty("email", expect.any(String));
        expect(res.body[0].user).toHaveProperty("firstname", expect.any(String));
        expect(res.body[0].user).toHaveProperty("lastname", expect.any(String));
        expect(res.body[0].user).toHaveProperty("address", expect.any(String));
        expect(res.body[0].user).toHaveProperty("role", expect.any(String));
        expect(res.body[0]).toHaveProperty("createdAt", expect.any(Number));
        expect(res.body[0].build).toHaveProperty("_id", expect.any(String));
        expect(res.body[0].build).toHaveProperty("storage", expect.any(Array));
        expect(res.body[0].build).toHaveProperty("gpu", expect.any(Array));
        expect(res.body[0].build).toHaveProperty("memory", expect.any(Object));
        expect(res.body[0].build).toHaveProperty("case", expect.any(Object));
        expect(res.body[0].build).toHaveProperty("motherboard", expect.any(Object));
        expect(res.body[0].build).toHaveProperty(
          "powerSupply",
          expect.any(Object)
        );
        expect(res.body[0]).toHaveProperty("shipmentStatus", expect.any(Boolean));
        done();
      });
  });
  test("Show One | Success Case : should send one history", (done) => {
    request(app)
      .get(`/history/${historyId}`)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).toBe(200);
        expect(res.body.build).toHaveProperty("cpu", expect.any(Object));
        expect(res.body.build).toHaveProperty("user", expect.any(Object));
        expect(res.body.build).toHaveProperty(
          "motherboard",
          expect.any(Object)
        );
        expect(res.body.build).toHaveProperty("memory", expect.any(Object));
        expect(res.body.build).toHaveProperty("storage", expect.any(Array));
        expect(res.body.build).toHaveProperty("gpu", expect.any(Array));
        expect(res.body.build).toHaveProperty("case", expect.any(Object));
        expect(res.body.build).toHaveProperty(
          "powerSupply",
          expect.any(Object)
        );
        done();
      });
  });
});

describe("Show History || Fail Case", () => {
  test("Show One | Fail Case : should send unauthorized", (done) => {
    request(app)
      .get(`/history/${historyId}`)
      .set("access_token", unauthorizedToken)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Unauthorized");

        done();
      });
  });
});

describe("Patch Shipment|| Success Case", () => {
  test("Patch Shipment | Should change the shipment status", (done) => {
    request(app)
      .patch(`/history/transactions/${historyId}`)
      .set("access_token", access_token)
      .send({ shipmentStatus: true })
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Updated 1 document(s)");

        done();
      });
  });
  test("Fail Case | Should send error when the changing shipment status", (done) => {
    request(app)
      .patch(`/history/transactions/${historyId}`)
      .set("access_token", access_token)
      .send({ shipmentStatus: 'test' })
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("there is a mistake on your input");

        done();
      });
  });
});
