const express = require("express");

const router = express.Router();

const userController = require("./user.controller");
const authController = require("../auth/auth.controller");

router.get("/users", userController.allUsers);
router.get(
  "/users/:userId",
  authController.requireSignin,
  userController.getUser
);
router.put(
  "/users/:userId",
  authController.requireSignin,
  userController.updateUser
);
router.delete(
  "/users/:userId",
  authController.requireSignin,
  userController.deleteUser
);

router.param("userId", userController.userById);

module.exports = router;
