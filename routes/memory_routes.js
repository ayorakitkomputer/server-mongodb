const express = require("express");
const router = express();

const Controller = require("../controllers/memory_controller");

router.get("/", Controller.showAllMemory);
router.get("/:id", Controller.showOneMemory);
router.post("/", Controller.addMemory);
router.put("/:id", Controller.editMemory);
router.delete("/:id", Controller.deleteMemory);

module.exports = router;
