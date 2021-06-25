const express = require("express");
const router = express.Router();
const userRoutes = require("./user_routes");
const buildsRoutes = require("./build_routes");
const authentication = require("../middlewares/authentication");

router.use("/", userRoutes);
router.use("/builds", authentication, buildsRoutes);

module.exports = router;
