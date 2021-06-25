const express = require("express");
const router = express.Router();
const userRoutes = require("./user_routes");
const buildsRoutes = require("./build_routes");
const authentication = require("../middlewares/authentication");
const gpuRoutes = require("./gpu_routes");
const motherboardRoutes = require("./motherboard_routes");
const caseRoutes = require("./case_routes");
const memoryRoutes = require("./memory_routes");
const caseFanRoutes = require("./case_fan_routes");

router.use("/", userRoutes);
router.use("/builds", authentication, buildsRoutes);
router.use("/gpu", gpuRoutes);
router.use("/motherboard", motherboardRoutes);
router.use("/case", caseRoutes);
router.use("/memory", memoryRoutes);
router.use("/caseFan", caseFanRoutes);

module.exports = router;
