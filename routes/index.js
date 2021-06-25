const express = require("express");
const router = express.Router();
const gpuRoutes = require("./gpu_routes");

//gpu, motherboard, case, memory, case_fan
router.use("/gpu", gpuRoutes);
router.use("/motherboard", gpuRoutes);
router.use("/case", gpuRoutes);
router.use("/memory", gpuRoutes);
router.use("/case_fan", gpuRoutes);

module.exports = router;
