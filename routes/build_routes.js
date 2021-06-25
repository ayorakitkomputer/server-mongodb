const express = require("express");
const router = express.Router();
const Builds = require("../controllers/build_controller");
const Authorization = require("../middlewares/authorization");

router.post("/", Builds.addBuild);
router.get("/:id", Authorization, Builds.getAllByUserId);
router.delete("/:id", Authorization, Builds.deleteBuild);

module.exports = router;
