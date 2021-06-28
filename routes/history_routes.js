const express = require("express");
const router = express.Router();
const History = require("../controllers/history_controller");
const Authorization = require("../middlewares/history_authorization");
const authentication = require("../middlewares/authentication");

router.use(authentication)
router.post("/", History.createHistory);
router.get("/", History.getHistory);
router.get("/:id", Authorization, History.getOne);

module.exports = router;
