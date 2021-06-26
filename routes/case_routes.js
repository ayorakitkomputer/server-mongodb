const express = require("express");
const router = express();

const Controller = require("../controllers/case_controller");
const adminAuthorization = require("../middlewares/admin_authorization");

router.use("/", adminAuthorization);
router.use("/:id", adminAuthorization);
router.get("/", Controller.showAllCase);
router.get("/:id", Controller.showOneCase);
router.post("/", Controller.addCase);
router.put("/:id", Controller.editCase);
router.delete("/:id", Controller.deleteCase);

module.exports = router;
