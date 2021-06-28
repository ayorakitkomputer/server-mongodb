const request = require("supertest");
const app = require("../app.js");
const { connect } = require("../config");
const Users = require("../models/users");
const { sign } = require("../helpers/jwt");

let access_token;
let email;
let userId;

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

    userId = newUser.id;
    email = newUser.email;
    access_token = sign(newUser);
}, 15000);

afterAll(() => {
    Users.destroyEmail(xenditCustomer.email);
});

let payment;
let payment_id;

describe("Show all || Success case", () => {
    test("Should return all of the available banks", (done) => {
      request(app)
        .get("/payment/va/list")
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) return done(err);
          console.log(res.body); ///////////// ingatttt hapus booo

          expect(res.status).toBe(200);
          expect(res.body).toStrictEqual(expect.any(Array));
          expect(res.body[0]).toStrictEqual(expect.any(Object));
          expect(res.body[0]).toHaveProperty("name", expect.any(String));
          expect(res.body[0]).toHaveProperty("code", expect.any(String));

          payment = {
            bankCode: res.body[0].code,
            expectedAmt: 1000000
          }

          done();
        });
    });
});

// payment id disini msh slh
describe("Create || Success Case", () => {
    test("Should create a new Virtual payment", (done) => {
      request(app)
        .post("/payment/va/invoice")
        .send(payment)
        .set("access_token", access_token)
        .end((err, res) => {
          console.log(res.body, `kekekekekek`);
          if (err) return done(err);

          // console.log(res.body);
          expect(res.status).toBe(201);
          expect(res.body).toStrictEqual(expect.any(Object));

          payment_id = res.body.id
          done();
        });
    });
});

describe("Fail Case", () => {
    test("Fail Case : should return an error message 'VA Name must not contain bank or institution name'", (done) => {
      request(app)
        .post("/payment/va/invoice")
        .send('60d980c85cdbf86b93514a6c')
        .set("access_token", access_token)
        .end((err, res) => {
          console.log(res.body, `kekekekekek`);
          if (err) return done(err);

          // console.log(res.body);
          expect(res.status).toBe(500);
          expect(res.body.message).toContain('VA Name must not contain bank or institution name');

          payment_id = res.body.id
          done();
        });
    });
});

// ini get all banks for virtual payment
// [
//   { name: 'Bank Mandiri', code: 'MANDIRI' },
//   { name: 'Bank Negara Indonesia', code: 'BNI' },
//   { name: 'Bank Rakyat Indonesia', code: 'BRI' },
//   { name: 'Bank Permata', code: 'PERMATA' },
//   { name: 'Bank Central Asia', code: 'BCA' }
// ]

// ini dpt pas create virtual payment
// {
//   is_closed: true,
//   status: 'PENDING',
//   currency: 'IDR',
//   owner_id: '60d69d7934edeb40a5dd2133',
//   external_id: 'id-1624867014275',
//   bank_code: 'MANDIRI',
//   merchant_code: '88908',
//   name: 'Customer PcPartPicker',
//   account_number: '889089999828546',
//   expected_amount: 99999999,
//   expiration_date: '2021-06-30T07:56:54.275Z',
//   is_single_use: true,
//   id: '60d980c85cdbf86b93514a6c'
// }



// describe("Create Fail case", () => {
//     test("Fail case | Failed because Build is not found", (done) => {
//         request(app)
//             .post("/history")
//             .send(wrongBuildId)
//             .set("access_token", access_token)
//             .end((err, res) => {
//                 if (err) return done(err);

//                 expect(res.status).toBe(500);
//                 expect(res.body.message).toContain("Build not found");

//                 done();
//             });
//     });
// });

// describe("Show History", () => {
//     test("Show all | Success Case : should send all of the Histories", (done) => {
//         request(app)
//             .get("/history")
//             .set("access_token", access_token)
//             .end((err, res) => {
//                 if (err) return done(err);

//                 expect(res.status).toBe(200);
//                 expect(res.body[0].build).toHaveProperty(
//                     "cpu",
//                     expect.any(Object)
//                 );
//                 expect(res.body[0].build).toHaveProperty(
//                     "user",
//                     expect.any(Object)
//                 );
//                 expect(res.body[0].build).toHaveProperty(
//                     "motherboard",
//                     expect.any(Object)
//                 );
//                 expect(res.body[0].build).toHaveProperty(
//                     "memory",
//                     expect.any(Object)
//                 );
//                 expect(res.body[0].build).toHaveProperty(
//                     "storage",
//                     expect.any(Array)
//                 );
//                 expect(res.body[0].build).toHaveProperty(
//                     "gpu",
//                     expect.any(Array)
//                 );
//                 expect(res.body[0].build).toHaveProperty(
//                     "case",
//                     expect.any(Object)
//                 );
//                 expect(res.body[0].build).toHaveProperty(
//                     "powerSupply",
//                     expect.any(Object)
//                 );
//                 done();
//             });
//     });
//     test("Show One | Success Case : should send one history", (done) => {
//         request(app)
//             .get(`/history/${historyId}`)
//             .set("access_token", access_token)
//             .end((err, res) => {
//                 if (err) return done(err);

//                 expect(res.status).toBe(200);
//                 expect(res.body.build).toHaveProperty(
//                     "cpu",
//                     expect.any(Object)
//                 );
//                 expect(res.body.build).toHaveProperty(
//                     "user",
//                     expect.any(Object)
//                 );
//                 expect(res.body.build).toHaveProperty(
//                     "motherboard",
//                     expect.any(Object)
//                 );
//                 expect(res.body.build).toHaveProperty(
//                     "memory",
//                     expect.any(Object)
//                 );
//                 expect(res.body.build).toHaveProperty(
//                     "storage",
//                     expect.any(Array)
//                 );
//                 expect(res.body.build).toHaveProperty("gpu", expect.any(Array));
//                 expect(res.body.build).toHaveProperty(
//                     "case",
//                     expect.any(Object)
//                 );
//                 expect(res.body.build).toHaveProperty(
//                     "powerSupply",
//                     expect.any(Object)
//                 );
//                 done();
//             });
//     });
// });

// describe("Show History || Fail Case", () => {
//     test("Show One | Fail Case : should send unauthorized", (done) => {
//         request(app)
//             .get(`/history/${historyId}`)
//             .set("access_token", unauthorizedToken)
//             .end((err, res) => {
//                 if (err) return done(err);

//                 expect(res.status).toBe(400);
//                 expect(res.body.message).toBe("Unauthorized");

//                 done();
//             });
//     });
// });
