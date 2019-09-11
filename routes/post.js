const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");
const userController = require("../controllers/user");
const postController = require("../controllers/post");

router.get("/", postController.getPosts);

router.post(
  "/posts/new/:userId",
  authController.requireSignin,
  postController.createPost
);

router.get(
  "/posts/by/:userId",
  authController.requireSignin,
  postController.postsByUser
);

router.put(
  "/posts/:postId",
  authController.requireSignin,
  postController.isPoster,
  postController.updatePost
);

router.delete(
  "/posts/:postId",
  authController.requireSignin,
  postController.isPoster,
  postController.deletePost
);

router.param("userId", userController.userById);
router.param("postId", postController.postById);

module.exports = router;
