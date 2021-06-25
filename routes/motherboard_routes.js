const express = require("express");
const router = express();

const Controller = require("../controllers/motherboard_controller");

router.get("/", Controller.showAllMotherboard);
router.get("/:id", Controller.showOneMotherboard);
router.post("/", Controller.addMotherboard);
router.put("/:id", Controller.editMotherboard);
router.delete("/:id", Controller.deleteMotherboard);

module.exports = router;
