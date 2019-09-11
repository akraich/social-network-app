const express = require("express");

const router = express.Router();

const postController = require("../controllers/post");

router.get("/", postController.getPosts);

router.post("/post", postController.createPost);

module.exports = router;
