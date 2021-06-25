const StorageController = require('../controllers/storage_controller')
const router = require('express').Router()

router.get('/', StorageController.getStorage)

router.post('/', StorageController.postStorage)

router.get('/:id', StorageController.getOneStorage)

router.put('/:id', StorageController.putStorage)

router.delete('/:id', StorageController.deleteStorage)

module.exports = router