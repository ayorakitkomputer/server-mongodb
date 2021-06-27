const request = require("supertest");
const app = require("../app.js");
const { connect } = require("../config");
const Users = require("../models/users");
const { sign } = require("../helpers/jwt");

let access_token;
let email;
let userId;
let historyId;

let historyCustomer = {
    email: "history@mail.com",
    password: "password",
    address: "Jakarta",
    firstname: "Customer",
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

    let newUser = {
        id: user.ops[0]._id,
        email: user.ops[0].email,
        role: user.ops[0].role,
    };

    userId = newUser.id;
    email = newUser.email;
    access_token = sign(newUser);
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

                historyId = res.body.id;
                done();
            });
    });
});

describe("Fail case", () => {
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
                expect(res.body[0].build).toHaveProperty(
                    "cpu",
                    expect.any(Object)
                );
                expect(res.body[0].build).toHaveProperty(
                    "user",
                    expect.any(Object)
                );
                expect(res.body[0].build).toHaveProperty(
                    "motherboard",
                    expect.any(Object)
                );
                expect(res.body[0].build).toHaveProperty(
                    "memory",
                    expect.any(Object)
                );
                expect(res.body[0].build).toHaveProperty(
                    "storage",
                    expect.any(Array)
                );
                expect(res.body[0].build).toHaveProperty(
                    "gpu",
                    expect.any(Array)
                );
                expect(res.body[0].build).toHaveProperty(
                    "case",
                    expect.any(Object)
                );
                expect(res.body[0].build).toHaveProperty(
                    "powerSupply",
                    expect.any(Object)
                );
                done();
            });
    });
    test("Show One | Success Case : should send an one history", (done) => {
        request(app)
            .get("/history")
            .send(historyId)
            .set("access_token", access_token)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.status).toBe(200);
                expect(res.body[0].build).toHaveProperty(
                    "cpu",
                    expect.any(Object)
                );
                expect(res.body[0].build).toHaveProperty(
                    "user",
                    expect.any(Object)
                );
                expect(res.body[0].build).toHaveProperty(
                    "motherboard",
                    expect.any(Object)
                );
                expect(res.body[0].build).toHaveProperty(
                    "memory",
                    expect.any(Object)
                );
                expect(res.body[0].build).toHaveProperty(
                    "storage",
                    expect.any(Array)
                );
                expect(res.body[0].build).toHaveProperty(
                    "gpu",
                    expect.any(Array)
                );
                expect(res.body[0].build).toHaveProperty(
                    "case",
                    expect.any(Object)
                );
                expect(res.body[0].build).toHaveProperty(
                    "powerSupply",
                    expect.any(Object)
                );
                done();
            });
    });
});
