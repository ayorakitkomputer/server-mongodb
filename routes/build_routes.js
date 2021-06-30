const express = require("express");
const router = express.Router();
const Builds = require("../controllers/build_controller");
const Motherboard = require("../controllers/motherboard_controller");
const Case = require("../controllers/case_controller");
const Memory = require("../controllers/memory_controller");
const Power_Supply = require("../controllers/power_supply_controller");
const Authorization = require("../middlewares/build_authorization");
const authentication = require("../middlewares/authentication");

router.use(authentication);

router.post("/", Builds.addBuild);
router.get("/", Builds.getAllByUserId);
router.get("/:id", Authorization, Builds.getById);
router.patch("/:id/cpu", Authorization, Builds.patchCpu);
router.get("/:id/motherboard", Motherboard.getBySocket);
router.patch("/:id/motherboard", Authorization, Builds.patchMotherboard);
router.get("/:id/memory", Authorization, Memory.getAllByType);
router.patch("/:id/memory", Authorization, Builds.patchMemory);
router.patch("/:id/storage", Authorization, Builds.patchStorage);
router.patch("/:id/gpu", Authorization, Builds.patchGpu);
router.get("/:id/case", Authorization, Case.getByFormFactor);
router.patch("/:id/case", Authorization, Builds.patchCase);
router.get("/:id/power_supply", Authorization, Power_Supply.getByWatt);
router.patch("/:id/power_supply", Authorization, Builds.patchPowerSupply);
router.patch("/:id/monitor", Authorization, Builds.patchMonitor);
router.patch("/:id/case_fan", Authorization, Builds.patchCaseFan);
router.delete("/:id", Authorization, Builds.deleteBuild);
router.post("/:id/name", Authorization, Builds.patchName);
router.post("/:id/remove", Authorization, Builds.deleteParts);

module.exports = router;
