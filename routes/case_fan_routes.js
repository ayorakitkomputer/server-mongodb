const express = require("express");
const router = express();
const Controller = require("../controllers/case_fan_controller");
const adminAuthorization = require("../middlewares/admin_authorization");
const authentication = require("../middlewares/authentication");

router.get("/", Controller.showAllCaseFan);
router.use(authentication)
router.use("/", adminAuthorization);
router.use("/:id", adminAuthorization);
router.get("/:id", Controller.showOneCaseFan);
router.post("/", Controller.addCaseFan);
router.put("/:id", Controller.editCaseFan);
router.delete("/:id", Controller.deleteCaseFan);

module.exports = router;
