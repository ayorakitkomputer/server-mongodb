const express = require("express");
const router = express();

const Controller = require("../controllers/gpu_controller");
const adminAuthorization = require("../middlewares/admin_authorization");
const authentication = require("../middlewares/authentication");

router.get("/", Controller.showAllGpu);
router.use(authentication);
router.use("/", adminAuthorization);
router.use("/:id", adminAuthorization);
router.get("/:id", Controller.showOneGpu);
router.post("/", Controller.addGpu);
router.put("/:id", Controller.editGpu);
router.delete("/:id", Controller.deleteGpu);

module.exports = router;
