const express = require("express");
const router = express.Router();
const Xendit = require("../controllers/xendit_controller");
const authentication = require("../middlewares/authentication");

router.use(authentication);
router.post("/callback", Xendit.allCallback);
router.get("/va/list", Xendit.getVirtualAccounts);
router.post("/va/invoice", Xendit.createVirtualAccount);
router.post("/va/status", Xendit.getVirtualAccountPaymentStatus);
router.post("/ew/checkout", Xendit.createEWalletPayment);
router.post("/ew/status", Xendit.getEWalletDetail);
router.post("/card/checkout", Xendit.createCreditCharge);
router.post("/card/status", Xendit.getCreditDetail);
router.post("/retail/checkout", Xendit.createRetailCharge);
router.post("/retail/status", Xendit.getRetailDetails);

module.exports = router;
