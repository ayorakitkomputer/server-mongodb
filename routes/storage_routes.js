const StorageController = require("../controllers/storage_controller");
const router = require("express").Router();
const adminAuthorization = require("../middlewares/admin_authorization");
const authentication = require("../middlewares/authentication");

router.get("/", StorageController.getStorage);
router.use(authentication)
router.use("/", adminAuthorization);
router.use("/:id", adminAuthorization);
router.post("/", StorageController.postStorage);
router.get("/:id", StorageController.getOneStorage);
router.put("/:id", StorageController.putStorage);
router.delete("/:id", StorageController.deleteStorage);

module.exports = router;
