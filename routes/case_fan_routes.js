const express = require("express");
const router = express();

const Controller = require("../controllers/case_fan_controller");

router.get("/", Controller.showAllCaseFan);
router.get("/:id", Controller.showOneCaseFan);
router.post("/", Controller.addCaseFan);
router.put("/:id", Controller.editCaseFan);
router.delete("/:id", Controller.deleteCaseFan);

module.exports = router;
