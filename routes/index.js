const express = require("express");
const router = express.Router();

const userRoutes = require("./user_routes");
const buildsRoutes = require("./build_routes");
const gpuRoutes = require("./gpu_routes");
const motherboardRoutes = require("./motherboard_routes");
const caseRoutes = require("./case_routes");
const memoryRoutes = require("./memory_routes");
const caseFanRoutes = require("./case_fan_routes");
const cpuRouter = require("./cpu_routes");
const storageRouter = require("./storage_routes");
const powerSupplyRouter = require("./power_supply_routes");
const monitorRouter = require("./monitor_routes");
const historyRoutes = require("./history_routes");

const authentication = require("../middlewares/authentication");

router.use("/", userRoutes);
router.use("/builds", authentication, buildsRoutes);
router.use("/history", authentication, historyRoutes);
router.use("/cpu", cpuRouter);
router.use("/storages", storageRouter);
router.use("/power-supplies", powerSupplyRouter);
router.use("/monitors", monitorRouter);
router.use("/gpu", gpuRoutes);
router.use("/motherboard", motherboardRoutes);
router.use("/case", caseRoutes);
router.use("/memory", memoryRoutes);
router.use("/caseFan", caseFanRoutes);

module.exports = router;
