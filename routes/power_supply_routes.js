const Power_supplyController = require('../controllers/power_supply_controller')
const router = require('express').Router()

router.get('/', Power_supplyController.getPower_supply)

router.post('/', Power_supplyController.postPower_supply)

router.get('/:id', Power_supplyController.getOnePower_supply)

router.put('/:id', Power_supplyController.putPower_supply)

router.delete('/:id', Power_supplyController.deletePower_supply)

module.exports = router