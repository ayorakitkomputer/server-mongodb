const CpuController = require("../controllers/cpu_controller");
const router = require("express").Router();
const adminAuthorization = require("../middlewares/admin_authorization");

router.use("/", adminAuthorization);
router.use("/:id", adminAuthorization);
router.get("/", CpuController.getCpu);
router.post("/", CpuController.postCpu);
router.get("/:id", CpuController.getOneCpu);
router.put("/:id", CpuController.putCpu);
router.delete("/:id", CpuController.deleteCpu);

module.exports = router;
