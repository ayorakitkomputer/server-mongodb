const express = require("express");
const router = express.Router();
const gpuRoutes = require("./gpu_routes");
const motherboardRoutes = require("./motherboard_routes");
const caseRoutes = require("./case_routes");
const memoryRoutes = require("./memory_routes");
const caseFanRoutes = require("./case_fan_routes");

router.use("/gpu", gpuRoutes);
router.use("/motherboard", motherboardRoutes);
router.use("/case", caseRoutes);
router.use("/memory", memoryRoutes);
router.use("/caseFan", caseFanRoutes);

module.exports = router;
