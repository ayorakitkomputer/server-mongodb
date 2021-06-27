const request = require("supertest");
const app = require("../app.js");
const { connect } = require("../config");
const Users = require("../models/users");
const { sign } = require("../helpers/jwt");

const compatibleParts = {
  cpuId: "60d5ca9fc6e53a61d8e36f50",
  motherboardId: "60d5cc1ec6e53a61d8e37018",
  storageIds: ["60d5564bd9726344c074845d"],
  caseId: "60d5cb9fc6e53a61d8e36fd3",
  memoryId: "60d5cb90c6e53a61d8e36fa0",
  powerSupplyId: "60d5d1cec6e53a61d8e37078",
  gpuIds: ["60d5c9e1c6e53a61d8e36eeb"],
  monitorIds: ["60d5f023c6e53a61d8e3711c"],
};

const notFoundParts = {
  cpuId: "60d5cc1ec6e53a61d8e37018",
  motherboardId: "60d5564bd9726344c074845d",
  storageIds: ["60d5ca9fc6e53a61d8e36f50"],
  caseId: "60d5564bd9726344c074845d",
  memoryId: "60d5564bd9726344c074845d",
  powerSupplyId: "60d5564bd9726344c074845d",
  gpuIds: ["60d5564bd9726344c074845d"],
  monitorIds: ["60d5564bd9726344c074845d"],
};

const notFoundBuild = "60d87aff6a94be0402b2d647";

let userCustomer = {
  email: "build@mail.com",
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

let userId;
let unauthorizedToken;
beforeAll(async () => {
  await connect();
  let user = await Users.create(userCustomer);
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
  access_token = sign(newUser);
  unauthorizedToken = sign(newUser2);
  userId = newUser.id;
}, 15000);

afterAll((done) => {
  Users.destroy(userId)
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

let buildId = "";

//patch cpu not yet
//powersupply by wattage
//get all by user id
// router.post("/", Builds.addBuild);
// router.get("/", Builds.getAllByUserId);
// router.post("/:id/motherboard", Authorization, Builds.patchMotherboard);
// router.post("/:id/memory", Authorization, Builds.patchMemory);
// router.post("/:id/storage", Authorization, Builds.patchStorage);
// router.post("/:id/gpu", Authorization, Builds.patchGpu);
// router.post("/:id/case", Authorization, Builds.patchCase);
// router.post("/:id/power_supply", Authorization, Builds.patchPowerSupply);
// router.post("/:id/monitor", Authorization, Builds.patchMonitor);
// router.get("/:id", Authorization, Builds.getById);
// router.delete("/:id", Authorization, Builds.deleteBuild);

describe("addBuild", () => {
  test("Success Case", (done) => {
    request(app)
      .post(`/builds`)
      .set("access_token", access_token)
      .send(compatibleParts)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("1 documents were inserted");
        buildId = res.body.id;
        done();
      });
  });
  test("Fail Case || cpu not found", (done) => {
    request(app)
      .post(`/builds`)
      .set("access_token", access_token)
      .send(notFoundParts)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toContain("CPU not found");
        done();
      });
  });
});

describe("getById", () => {
  test("Success Case", (done) => {
    request(app)
      .get(`/builds`)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty("_id", expect.any(String));
        expect(res.body[0]).toHaveProperty("cpu", expect.any(Object));
        buildId = res.body[0]._id;
        done();
      });
  });
});

describe("patchMotherboard", () => {
  test("Success Case", (done) => {
    request(app)
      .post(`/builds/${buildId}/motherboard`)
      .set("access_token", access_token)
      .send({ motherboardId: compatibleParts.motherboardId })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("Updated 1 document(s)");
        done();
      });
  });
  test("Fail Case || Motherboard not found", (done) => {
    request(app)
      .post(`/builds/${buildId}/motherboard`)
      .set("access_token", access_token)
      .send(notFoundParts)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(500);
        expect(res.body.message).toContain("Motherboard not found");
        done();
      });
  });
  const newbuilds = {
    ...compatibleParts,
    motherboardId: "60d5cc1ec6e53a61d8e37028",
  };
  test("Fail Case || Motherboard not found", (done) => {
    request(app)
      .post(`/builds/${buildId}/motherboard`)
      .set("access_token", access_token)
      .send(newbuilds)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(500);
        expect(res.body.message).toContain("Motherboard is not compatible");
        done();
      });
  });
});

describe("patchMemory", () => {
  test("Success Case", (done) => {
    request(app)
      .post(`/builds/${buildId}/memory`)
      .set("access_token", access_token)
      .send({ memoryId: compatibleParts.memoryId })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("Updated 1 document(s)");
        done();
      });
  });
  test("Fail Case || Memory not found", (done) => {
    request(app)
      .post(`/builds/${buildId}/memory`)
      .set("access_token", access_token)
      .send(notFoundParts)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(500);
        expect(res.body.message).toContain("Memory not found");
        done();
      });
  });
  const newbuilds = {
    ...compatibleParts,
    memoryId: "60d5cb90c6e53a61d8e36fbd",
  };
  test("Fail Case || Memory not compatible", (done) => {
    request(app)
      .post(`/builds/${buildId}/memory`)
      .set("access_token", access_token)
      .send(newbuilds)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(500);
        expect(res.body.message).toContain("Memory is not compatible");
        done();
      });
  });
});

describe("patchStorage", () => {
  test("Success Case", (done) => {
    request(app)
      .post(`/builds/${buildId}/storage`)
      .set("access_token", access_token)
      .send(compatibleParts)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("Updated 1 document(s)");
        done();
      });
  });
  test("Fail Case || Storage not found", (done) => {
    request(app)
      .post(`/builds/${buildId}/storage`)
      .set("access_token", access_token)
      .send(notFoundParts)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(500);
        expect(res.body.message).toContain("Storage not found");
        done();
      });
  });
  test("Fail Case || Storage must be an Array", (done) => {
    request(app)
      .post(`/builds/${buildId}/storage`)
      .set("access_token", access_token)
      .send({ storageIds: "60d5ca9fc6e53a61d8e36f50" })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(500);
        expect(res.body.message).toContain("Storages must be an Array");
        done();
      });
  });
});

describe("patchGpu", () => {
  test("Success Case", (done) => {
    request(app)
      .post(`/builds/${buildId}/gpu`)
      .set("access_token", access_token)
      .send(compatibleParts)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("Updated 1 document(s)");
        done();
      });
  });
  test("Fail Case || GPU not found", (done) => {
    request(app)
      .post(`/builds/${buildId}/gpu`)
      .set("access_token", access_token)
      .send(notFoundParts)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(500);
        expect(res.body.message).toContain("GPU not found");
        done();
      });
  });
  test("Fail Case || GPU cannot be more than 3", (done) => {
    request(app)
      .post(`/builds/${buildId}/gpu`)
      .set("access_token", access_token)
      .send({
        gpuIds: [
          "60d5c9e1c6e53a61d8e36eeb",
          "60d5c9e1c6e53a61d8e36ef2",
          "60d5c9e1c6e53a61d8e36eec",
          "60d5c9e1c6e53a61d8e36eef",
        ],
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(500);
        expect(res.body.message).toContain("GPU cannot more than 3");
        done();
      });
  });
  test("Fail Case || GPU must be an Array", (done) => {
    request(app)
      .post(`/builds/${buildId}/gpu`)
      .set("access_token", access_token)
      .send({
        gpuIds: "60d5c9e1c6e53a61d8e36eeb",
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(500);
        expect(res.body.message).toContain("GPUs must be an Array");
        done();
      });
  });
});

describe("patchCase", () => {
  test("Success Case", (done) => {
    request(app)
      .post(`/builds/${buildId}/case`)
      .set("access_token", access_token)
      .send({ caseId: compatibleParts.caseId })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("Updated 1 document(s)");
        done();
      });
  });
  test("Fail Case || Case not found", (done) => {
    request(app)
      .post(`/builds/${buildId}/case`)
      .set("access_token", access_token)
      .send(notFoundParts)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(500);
        expect(res.body.message).toContain("Case not found");
        done();
      });
  });
  const newbuilds = {
    ...compatibleParts,
    caseId: "60d849ff95818839880a31d5",
  };
  test("Fail Case || Case not compatible", (done) => {
    request(app)
      .post(`/builds/${buildId}/case`)
      .set("access_token", access_token)
      .send(newbuilds)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(500);
        expect(res.body.message).toContain("Case is not compatible");
        done();
      });
  });
});

describe("patchPowerSupply", () => {
  test("Success Case", (done) => {
    request(app)
      .post(`/builds/${buildId}/power_supply`)
      .set("access_token", access_token)
      .send({ powerSupplyId: compatibleParts.powerSupplyId })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("Updated 1 document(s)");
        done();
      });
  });
  test("Fail Case || Power supply not found", (done) => {
    request(app)
      .post(`/builds/${buildId}/power_supply`)
      .set("access_token", access_token)
      .send(notFoundParts)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(500);
        expect(res.body.message).toContain("Power supply not found");
        done();
      });
  });
});

describe("patchMonitor", () => {
  test("Success Case", (done) => {
    request(app)
      .post(`/builds/${buildId}/monitor`)
      .set("access_token", access_token)
      .send(compatibleParts)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("Updated 1 document(s)");
        done();
      });
  });
  test("Fail Case || Monitor not found", (done) => {
    request(app)
      .post(`/builds/${buildId}/monitor`)
      .set("access_token", access_token)
      .send(notFoundParts)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(500);
        expect(res.body.message).toContain("Monitor not found");
        done();
      });
  });
  test("Fail Case || Monitor not found", (done) => {
    request(app)
      .post(`/builds/${buildId}/monitor`)
      .set("access_token", access_token)
      .send({ monitorIds: "60d5f023c6e53a61d8e3711c" })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(500);
        expect(res.body.message).toContain("Monitors must be an Array");
        done();
      });
  });
});

describe("deleteBuild", () => {
  test("Fail Case || build unAuthorized", (done) => {
    request(app)
      .delete(`/builds/${buildId}`)
      .set("access_token", unauthorizedToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toContain(`Unauthorized`);
        done();
      });
  });
  test("Fail Case || build id not found", (done) => {
    request(app)
      .delete(`/builds/${notFoundBuild}`)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toContain(
          `No documents matched the query. Deleted 0 documents.`
        );
        done();
      });
  });
  test("Success Case", (done) => {
    request(app)
      .delete(`/builds/${buildId}`)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain(
          `Successfully deleted one document.`
        );
        done();
      });
  });
});
