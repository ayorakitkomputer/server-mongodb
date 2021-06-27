const express = require("express");
const router = express.Router();
const Builds = require("../controllers/build_controller");
const Authorization = require("../middlewares/build_authorization");
const authentication = require("../middlewares/authentication");

router.use(authentication)
router.post("/", Builds.addBuild);
router.get("/", Builds.getAllByUserId);
router.post("/:id/motherboard", Authorization, Builds.patchMotherboard);
router.post("/:id/memory", Authorization, Builds.patchMemory);
router.post("/:id/storage", Authorization, Builds.patchStorage);
router.post("/:id/gpu", Authorization, Builds.patchGpu);
router.post("/:id/case", Authorization, Builds.patchCase);
router.post("/:id/power_supply", Authorization, Builds.patchPowerSupply);
router.post("/:id/monitor", Authorization, Builds.patchMonitor);
router.get("/:id", Authorization, Builds.getById);
router.delete("/:id", Authorization, Builds.deleteBuild);

module.exports = router;
