const express = require("express");
const router = express();
const Controller = require("../controllers/case_controller");
const adminAuthorization = require("../middlewares/admin_authorization");
const authentication = require("../middlewares/authentication");

router.get("/", Controller.showAllCase);
router.use(authentication);
router.use("/", adminAuthorization);
router.use("/:id", adminAuthorization);
router.get("/:id", Controller.showOneCase);
router.post("/", Controller.addCase);
router.put("/:id", Controller.editCase);
router.delete("/:id", Controller.deleteCase);

module.exports = router;
