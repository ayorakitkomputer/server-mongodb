const express = require("express");
const router = express();

const Controller = require("../controllers/case_controller");

router.get("/", Controller.showAllCase);
router.get("/:id", Controller.showOneCase);
router.post("/", Controller.addCase);
router.put("/:id", Controller.editCase);
router.delete("/:id", Controller.deleteCase);

module.exports = router;
