const express = require("express");
const router = express.Router();
const History = require("../controllers/history_controller");
const Authorization = require("../middlewares/history_authorization");

router.post("/", History.createHistory);
router.get("/", History.getHistory);
router.get("/:id", Authorization, History.getOne);

module.exports = router;
