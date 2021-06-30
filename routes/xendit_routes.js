const express = require("express");
const router = express.Router();
const Xendit = require("../controllers/xendit_controller");
const authentication = require("../middlewares/authentication");

router.use(authentication);
router.post("/invoice", Xendit.createInvoice);

module.exports = router;
