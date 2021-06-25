<<<<<<< HEAD
const router = require('express').Router()

// jourdy
const cpuRouter = require('./cpu_routes')
const storageRouter = require('./storage_routes')
const powerSupplyRouter = require('./power_supply_routes')
const monitorRouter = require('./monitor_routes')

router.use('/cpu', cpuRouter)
router.use('/storages', storageRouter)
router.use('/power-supplies', powerSupplyRouter)
router.use('/monitors', monitorRouter)
//

module.exports = router
=======
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
>>>>>>> 89a74b16d44f3dfb0ab167aa903da8afea22bf93
