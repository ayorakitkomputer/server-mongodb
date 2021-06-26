const express = require("express");
const router = express.Router();
const Users = require("../controllers/user_controller");

router.post("/register", Users.register);
router.post("/login", Users.login);
router.get("/", (_, res) => {
	res.status(200).json({ message: "Welcome" });
});

module.exports = router;
