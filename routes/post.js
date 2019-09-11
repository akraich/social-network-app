const express = require("express");

const router = express.Router();

const postController = require("../controllers/post");
const authController = require("../controllers/auth");

router.get("/", postController.getPosts);

router.post("/post", authController.requireSignin, postController.createPost);

module.exports = router;
