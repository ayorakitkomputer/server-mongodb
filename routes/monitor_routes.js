const MonitorController = require("../controllers/monitor_controller");
const router = require("express").Router();
const adminAuthorization = require("../middlewares/admin_authorization");
const authentication = require("../middlewares/authentication");

router.get("/", MonitorController.getMonitor);
router.use(authentication)
router.use("/", adminAuthorization);
router.use("/:id", adminAuthorization);
router.post("/", MonitorController.postMonitor);
router.get("/:id", MonitorController.getOneMonitor);
router.put("/:id", MonitorController.putMonitor);
router.delete("/:id", MonitorController.deleteMonitor);

module.exports = router;
