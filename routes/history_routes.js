const express = require("express");
const router = express.Router();
const History = require("../controllers/history_controller");
const Authorization = require("../middlewares/history_authorization");
const authentication = require("../middlewares/authentication");
const AdminAuthorization = require("../middlewares/admin_authorization");

router.use(authentication);
router.post("/", History.createHistory);
router.get("/", History.getHistory);
router.get("/transactions", History.getAllHistory);
router.get("/:id", Authorization, History.getOne);
router.patch("/transactions/:id", History.patchShipment);

module.exports = router;
