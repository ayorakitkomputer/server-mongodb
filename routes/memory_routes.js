const express = require("express");
const router = express();
const Controller = require("../controllers/memory_controller");
const adminAuthorization = require("../middlewares/admin_authorization");
const authentication = require("../middlewares/authentication");

router.get("/", Controller.showAllMemory);
router.use(authentication)
router.use("/", adminAuthorization);
router.use("/:id", adminAuthorization);
router.get("/:id", Controller.showOneMemory);
router.post("/", Controller.addMemory);
router.put("/:id", Controller.editMemory);
router.delete("/:id", Controller.deleteMemory);

module.exports = router;
