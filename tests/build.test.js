const request = require("supertest");
const app = require("../app.js");
const { connect } = require("../config");
const Users = require("../models/users");
const { sign } = require("../helpers/jwt");
const Builds = require("../models/builds.js");
const Cpu = require("../models/cpu.js");
const Motherboard = require("../models/motherboard.js");
const Gpu = require("../models/gpu.js");
const Storage = require("../models/storage");
const Power_Supply = require("../models/power_supply");
const Memory = require("../models/memory");
const Case_Fan = require("../models/case_fan");
const Case = require("../models/case");
const Monitor = require("../models/monitor");

// compatible parts
cpu = {"manufacturer":"Intel","name":"COMPATIBLE WITH MOTHERBOARD 2","socket":"AM4","igpu":true,"tdp":125,"price":5741840.5,"stock":76,"image":"https://tonixcomputer.co.id/wp-content/uploads/2020/05/Intel-Core-i7-8700K.png"}

motherboard = {"name":"TUF GAMING X570-PLUS","manufacturer":"Asus","socket":"AM4","memory_type":"DDR4","form_factor":"ATX","price":3030341,"stock":84,"image":"https://dlcdnimgs.asus.com/websites/global/products/sqlhk1j3w9jgpcci/img/z490/kv/hero.png"}

motherboard2 = {"name":"TUF GAMING X570-PLUS","manufacturer":"Asus","socket":"LG1200","memory_type":"DDR4","form_factor":"ATX","price":3030341,"stock":84,"image":"https://dlcdnimgs.asus.com/websites/global/products/sqlhk1j3w9jgpcci/img/z490/kv/hero.png"}

pcCase = {"name":"NZXT H510","form_factor":"ATX","stock":111,"price":1116181,"image":"https://images.tokopedia.net/img/cache/500-square/product-1/2017/11/12/24444250/24444250_34071435-6ddd-452f-9773-3c321eed07eb_700_700.png.webp"}

pcCase2 = {"name":"NOT COMPATIBLE","form_factor":"Mini ITX","stock":69,"price":924781,"image":"https://tonixcomputer.co.id/wp-content/uploads/2020/05/Cooler-Master-Trooper-SE.png"}

gpu = {"manufacturer":"EVGA","name":"GeForce RTX 3090","price":35687806,"tdp":350,"stock":54,"image":"https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"}

storage = {"name":"Western Digital Caviar Blue","image":"https://images.tokopedia.net/img/cache/700/product-1/2020/4/28/234603/234603_c9798c71-b425-464b-914f-3b0555b67c83_1500_1500","type":"HD","capacity":"1 TB","price":740000,"stock":5}

case_fan = {"name":"Thermaltake Riing Trio 14 RGB TT Premium Edition 3-Pack","size":"140 mm","stock":107,"price":2392341,"image":"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png"}

memory = {"name":"Corsair Vengeance RGB Pro 16 GB","memory_type":"DDR4","speed":3200,"price":1515091,"stock":46,"image":"https://images.tokopedia.net/img/cache/500-square/product-1/2020/7/2/1298494/1298494_9d6992c2-da03-4eba-bec6-4a8e376e0867_1200_1200.jpg.webp"}

memory2 = {"name":"NOT COMPATIBLE WITH MOTHERBOARD 1","memory_type":"DDR3","speed":1600,"price":1196091,"stock":91,"image":"https://images.tokopedia.net/img/cache/500-square/product-1/2020/7/2/1298494/1298494_9d6992c2-da03-4eba-bec6-4a8e376e0867_1200_1200.jpg.webp"}

monitor = {"name":"VX2758-2KP-MHD","manufacturer":"ViewSonic","size":27,"price":4784840.5,"stock":119,"image":"https://www.viewsonic.com/vsAssetFile/ap/img/resize/product-rc/_lcd_display_(new)/XG2405/xg2405_w640.webp"}

powerSupply = {"name":"Corsair AXi","efficiency_rating":"80+ Titanium","wattage":1600,"price":13556862,"stock":109,"image":"https://ecs7.tokopedia.net/img/cache/700/product-1/2017/8/28/1361407/1361407_f7a960dd-16be-4b1e-84ef-310cc05100e3_750_558.png"}

powerSupply2 = {"name":"Corsair AXi 2","efficiency_rating":"80+ Gold","wattage":300,"price":1111111,"stock":11,"image":"https://ecs7.tokopedia.net/img/cache/700/product-1/2017/8/28/1361407/1361407_f7a960dd-16be-4b1e-84ef-310cc05100e3_750_558.png"}



/* 
mobo nya itu am4, ddr4, ATX

cpuId: "60d5ca9fc6e53a61d8e36f50", // data g ada
*/

const notFoundParts = {
    cpuId: "60d5cc1ec6e53a61d8e37018",
    motherboardId: "60d5564bd9726344c074845d",
    storageIds: ["60d5ca9fc6e53a61d8e36f50"],
    caseId: "60d5564bd9726344c074845d",
    memoryId: "60d5564bd9726344c074845d",
    powerSupplyId: "60d5564bd9726344c074845d",
    gpuIds: ["60d5564bd9726344c074845d"],
    monitorIds: ["60d5564bd9726344c074845d"],
    caseFanIds: ["60d5564bd9726344c074845d"]
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
let userId2;
let access_token;
let unauthorizedToken;

let cpuId;
let motherboardId;
let motherboardId2;
let caseFanIds = []
let gpuIds = []
let storageIds = []
let monitorIds = []
let caseId;
let caseId2;
let powerSupplyId;
let powerSupplyId2;
let memoryId;
let memoryId2;


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
    userId2 = newUser2.id;

    const cpuData = await Cpu.create(cpu)
    cpuId = cpuData.ops[0]._id
    
    const motherboardData = await Motherboard.create(motherboard)
    motherboardId = motherboardData.ops[0]._id

    const motherboardData2 = await Motherboard.create(motherboard2)
    motherboardId2 = motherboardData2.ops[0]._id
    
    const gpuData = await Gpu.create(gpu) // arraay
    gpuIds.push(gpuData.ops[0]._id)
    
    const storageData = await Storage.create(storage)
    storageIds.push(storageData.ops[0]._id)
    
    const monitorData = await Monitor.create(cpu)
    monitorIds.push(monitorData.ops[0]._id)
    
    const caseData = await Case.create(pcCase) // atx kan
    caseId = caseData.ops[0]._id

    const caseData2 = await Case.create(pcCase2) // ini ukuran beda
    caseId2 = caseData2.ops[0]._id
    
    const caseFanDdata = await Case_Fan.create(case_fan)
    caseFanIds.push(caseFanDdata.ops[0]._id)
    
    const memoryData = await Memory.create(memory)
    memoryId = memoryData.ops[0]._id

    const memoryData2 = await Memory.create(memory2)
    memoryId2 = memoryData2.ops[0]._id
    
    const powerSupplyData = await Power_Supply.create(powerSupply)
    powerSupplyId = powerSupplyData.ops[0]._id

    const powerSupplyData2 = await Power_Supply.create(powerSupply2) // smaller wattage
    powerSupplyId2 = powerSupplyData2.ops[0]._id
    
}, 7000); // booooooooooooooooooooooooooooooooooooooooooooooooooooooo

let buildId = "";

afterAll((done) => {
    Users.destroy(userId)
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });

    Users.destroy(userId2)
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });

    Cpu.destroy(cpuId)
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });

    Gpu.destroy(gpuIds[0])
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });

    Storage.destroy(storageIds[0])
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });

    Monitor.destroy(monitorIds[0])
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });

    Case.destroy(caseId)
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });

    Case_Fan.destroy(caseFanIds[0])
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });

    Memory.destroy(memoryId)
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });

    Memory.destroy(memoryId2)
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });

    Power_Supply.destroy(powerSupplyId)
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });

    Power_Supply.destroy(powerSupplyId2)
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });

    Motherboard.destroy(motherboardId)
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });

    Motherboard.destroy(motherboardId2)
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });
});


describe("addBuild", () => {
    test("Success Case || Should make a new build and send the build id", (done) => {
        request(app)
            .post(`/builds`)
            .set("access_token", access_token)
            .end((err, res) => {
                if (err) done(err);

                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("id", expect.any(String));
                buildId = res.body.id;
                done();
            });
    });
});

describe("getById", () => {
    test("Success Case || Should send initial build data as an object", (done) => {
        request(app)
            .get(`/builds/` + buildId)
            .set("access_token", access_token)
            .end((err, res) => {
                if (err) done(err);
                
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("_id", buildId);
                expect(res.body.user).toHaveProperty("id", expect.any(String));
                done();
            });
    });
});

describe("patchCpu", () => {
    test("Success Case", (done) => {
        request(app)
            .patch(`/builds/${buildId}/cpu`)
            .set("access_token", access_token)
            .send({ cpuId })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(200);
                expect(res.body.message).toContain("Updated 1 document(s)");
                done();
            });
    });
    test("Fail Case || cpu not found", (done) => {
        request(app)
            .patch(`/builds/${buildId}/cpu`)
            .set("access_token", access_token)
            .send({ cpuId: notFoundParts.cpuId })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(404);
                expect(res.body.message).toContain("CPU not found");
                done();
            });
    });
});

/* 

mobo nya itu am4, ddr4, ATX
mobo yg slh itu intel 1200
cpu am4 tdp 95


// */
describe("patchMotherboard", () => {
    test("Success Case", (done) => {
        request(app)
            .patch(`/builds/${buildId}/motherboard`)
            .set("access_token", access_token)
            .send({ motherboardId })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(200);
                expect(res.body.message).toContain("Updated 1 document(s)");
                done();
            });
    });
    test("Fail Case || Motherboard not found", (done) => {
        request(app)
            .patch(`/builds/${buildId}/motherboard`)
            .set("access_token", access_token)
            .send({ motherboardId: notFoundParts.motherboardId })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(404);
                expect(res.body.message).toContain("Motherboard not found");
                done();
            });
    });
    test("Fail Case || Motherboard is not compatible", (done) => {
        request(app)
            .patch(`/builds/${buildId}/motherboard`)
            .set("access_token", access_token)
            .send({ motherboardId: motherboardId2 })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(400);
                expect(res.body.message).toContain(
                    "Motherboard is not compatible"
                );
                done();
            });
    });
});

describe("patchMemory", () => {
    test("Success Case", (done) => {
        request(app)
            .patch(`/builds/${buildId}/memory`)
            .set("access_token", access_token)
            .send({ memoryId })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(200);
                expect(res.body.message).toContain("Updated 1 document(s)");
                done();
            });
    });
    test("Fail Case || Memory not found", (done) => {
        request(app)
            .patch(`/builds/${buildId}/memory`)
            .set("access_token", access_token)
            .send({ memoryId: notFoundParts.memoryId })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(404);
                expect(res.body.message).toContain("Memory not found");
                done();
            });
    });
    test("Fail Case || Memory not compatible", (done) => {
        request(app)
            .patch(`/builds/${buildId}/memory`)
            .set("access_token", access_token)
            .send({ memoryId: memoryId2 })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(400);
                expect(res.body.message).toContain("Memory is not compatible");
                done();
            });
    });
});

describe("patchStorage", () => {
    test("Success Case", (done) => {
        request(app)
            .patch(`/builds/${buildId}/storage`)
            .set("access_token", access_token)
            .send({ storageIds: [ storageIds[0] ]})
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(200);
                expect(res.body.message).toContain("Updated 1 document(s)");
                done();
            });
    });
    test("Fail Case || Storage not found", (done) => {
        request(app)
            .patch(`/builds/${buildId}/storage`)
            .set("access_token", access_token)
            .send({ storageIds: [ notFoundParts.storageIds[0] ] })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(404);
                expect(res.body.message).toContain("Storage not found");
                done();
            });
    });
    test("Fail Case || Storage must be an Array", (done) => {
        request(app)
            .patch(`/builds/${buildId}/storage`)
            .set("access_token", access_token)
            .send({ storageIds: "60d5ca9fc6e53a61d8e36f50" })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(400);
                expect(res.body.message).toContain("Storages must be an Array");
                done();
            });
    });
    test("Fail Case || Storage cannot more than 3", (done) => {
        request(app)
            .patch(`/builds/${buildId}/storage`)
            .set("access_token", access_token)
            .send({ storageIds: ["60d5ca9fc6e53a61d8e36f50","60d5ca9fc6e53a61d8e36f50", "60d5ca9fc6e53a61d8e36f50", "60d5ca9fc6e53a61d8e36f50"] })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(400);
                expect(res.body.message).toContain("Storage cannot more than 3");
                done();
            });
    });
});

describe("patchGpu", () => {
    test("Success Case", (done) => {
        request(app)
            .patch(`/builds/${buildId}/gpu`)
            .set("access_token", access_token)
            .send({ gpuIds: [ gpuIds[0] ]})
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(200);
                expect(res.body.message).toContain("Updated 1 document(s)");
                done();
            });
    });
    test("Fail Case || GPU not found", (done) => {
        request(app)
            .patch(`/builds/${buildId}/gpu`)
            .set("access_token", access_token)
            .send({ gpuIds: [ notFoundParts.gpuIds[0] ]})
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(404);
                expect(res.body.message).toContain("GPU not found");
                done();
            });
    });
    test("Fail Case || GPU cannot be more than 3", (done) => {
        request(app)
            .patch(`/builds/${buildId}/gpu`)
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
                expect(res.status).toBe(400);
                expect(res.body.message).toContain("GPU cannot more than 3");
                done();
            });
    });
    test("Fail Case || GPU must be an Array", (done) => {
        request(app)
            .patch(`/builds/${buildId}/gpu`)
            .set("access_token", access_token)
            .send({
                gpuIds: "60d5c9e1c6e53a61d8e36eeb",
            })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(400);
                expect(res.body.message).toContain("GPUs must be an Array");
                done();
            });
    });
});

describe("patchCase", () => {
    test("Success Case", (done) => {
        request(app)
            .patch(`/builds/${buildId}/case`)
            .set("access_token", access_token)
            .send({ caseId })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(200);
                expect(res.body.message).toContain("Updated 1 document(s)");
                done();
            });
    });
    test("Fail Case || Case not found", (done) => {
        request(app)
            .patch(`/builds/${buildId}/case`)
            .set("access_token", access_token)
            .send({ caseId: notFoundParts.caseId })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(404);
                expect(res.body.message).toContain("Case not found");
                done();
            });
    });
    test("Fail Case || Case not compatible", (done) => {
        request(app)
            .patch(`/builds/${buildId}/case`)
            .set("access_token", access_token)
            .send({ caseId: caseId2 })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(400);
                expect(res.body.message).toContain("Case is not compatible");
                done();
            });
    });
});

describe("patchPowerSupply", () => {
    test("Success Case", (done) => {
        request(app)
            .patch(`/builds/${buildId}/power_supply`)
            .set("access_token", access_token)
            .send({ powerSupplyId })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(200);
                expect(res.body.message).toContain("Updated 1 document(s)");
                done();
            });
    });
    test("Fail Case || Power supply not found", (done) => {
        request(app)
            .patch(`/builds/${buildId}/power_supply`)
            .set("access_token", access_token)
            .send({ powerSupplyId: notFoundParts.powerSupplyId })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(404);
                expect(res.body.message).toContain("Power supply not found");
                done();
            });
    });
    test("Fail Case || Need power supply with more wattage", (done) => {
        request(app)
            .patch(`/builds/${buildId}/power_supply`)
            .set("access_token", access_token)
            .send({ powerSupplyId: powerSupplyId2 }) // wattage dkt cmn 400
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(400);
                expect(res.body.message).toContain("Need power supply with more wattage");
                done();
            });
    });
});

describe("patchMonitor", () => {
    test("Success Case", (done) => {
        request(app)
            .patch(`/builds/${buildId}/monitor`)
            .set("access_token", access_token)
            .send({ monitorIds: [ monitorIds[0] ]})
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(200);
                expect(res.body.message).toContain("Updated 1 document(s)");
                done();
            });
    });
    test("Fail Case || Monitor not found", (done) => {
        request(app)
            .patch(`/builds/${buildId}/monitor`)
            .set("access_token", access_token)
            .send({ monitorIds: [ notFoundParts.monitorIds[0] ]})
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(404);
                expect(res.body.message).toContain("Monitor not found");
                done();
            });
    });
    test("Fail Case || Monitor must be an Array", (done) => {
        request(app)
            .patch(`/builds/${buildId}/monitor`)
            .set("access_token", access_token)
            .send({ monitorIds: "60d5f023c6e53a61d8e3711c" })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(400);
                expect(res.body.message).toContain("Monitors must be an Array");
                done();
            });
    });
});

describe("patchCaseFan", () => {
    test("Success Case", (done) => {
        request(app)
            .patch(`/builds/${buildId}/case_fan`)
            .set("access_token", access_token)
            .send({ caseFanIds: [ caseFanIds[0] ]})
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(200);
                expect(res.body.message).toContain("Updated 1 document(s)");
                done();
            });
    });
    test("Fail Case || Case Fan not found", (done) => {
        request(app)
            .patch(`/builds/${buildId}/case_fan`)
            .set("access_token", access_token)
            .send({ caseFanIds: [ notFoundParts.caseFanIds[0] ]})
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(404);
                expect(res.body.message).toContain("Case Fan not found");
                done();
            });
    });
    test("Fail Case || Case Fans must be an Array", (done) => {
        request(app)
            .patch(`/builds/${buildId}/case_fan`)
            .set("access_token", access_token)
            .send({ caseFanIds: "60d5f023c6e53a61d8e3711c" })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toBe(400);
                expect(res.body.message).toContain("Case Fans must be an Array");
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
