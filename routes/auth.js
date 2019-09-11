const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/signout", authController.signout);

module.exports = router;
