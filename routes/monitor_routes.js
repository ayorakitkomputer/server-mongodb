const MonitorController = require("../controllers/monitor_controller");
const router = require("express").Router();

const adminAuthorization = require("../middlewares/admin_authorization");

router.use("/", adminAuthorization);
router.use("/:id", adminAuthorization);
router.get("/", MonitorController.getMonitor);
router.post("/", MonitorController.postMonitor);
router.get("/:id", MonitorController.getOneMonitor);
router.put("/:id", MonitorController.putMonitor);
router.delete("/:id", MonitorController.deleteMonitor);

module.exports = router;
