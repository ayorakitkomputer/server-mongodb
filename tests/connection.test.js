const request = require("supertest");
const app = require("../app.js");
const { connect } = require("../config");

let connection;

beforeAll(async () => {
    connection = await connect();
});

describe("GPU", () => {
    it("should read the array and have the properties", (done) => {
        request(app)
            .get("/gpu")
            .end((err, res) => {
                if (err) return done(err);
                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body[0]).toHaveProperty("name", expect.any(String));
                expect(res.body[0]).toHaveProperty(
                    "manufacturer",
                    expect.any(String)
                );
                expect(res.body[0]).toHaveProperty("price", expect.any(Number));
                expect(res.body[0]).toHaveProperty("tdp", expect.any(Number));
                expect(res.body[0]).toHaveProperty("stock", expect.any(Number));
                expect(res.body[0]).toHaveProperty("image", expect.any(String));
                done();
            });
    });

    it("should create a new gpu", (done) => {
        let newGpu = {
            name: "RTX 501000",
            image: "https://images.evga.com/products/gallery/png/08G-P5-3663-KR_LG_1.png",
            manufacturer: "EVGA",
            tdp: 999990,
            price: 1300000,
            stock: 5,
        };
        request(app)
            .post("/gpu")
            .send(newGpu)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.status).toBe(201);
                // console.log(res.body);
                expect(res.body).toHaveProperty("price", expect.any(Number));
                expect(res.body).toHaveProperty("tdp", expect.any(Number));
                expect(res.body).toHaveProperty("stock", expect.any(Number));
                expect(res.body).toHaveProperty("image", expect.any(String));
                done();
            });
    });
});
