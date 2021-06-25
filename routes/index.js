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