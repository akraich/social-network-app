import express from "express";

const router = express.Router();

import { requireSignin } from "../auth/auth.controller";
import { userById } from "../user/user.controller";
import {
  createPost,
  postsByUser,
  postById,
  isPoster,
  updatePost,
  deletePost,
  getPosts
} from "../post/post.controller";

router.get("/", getPosts);

router.post("/posts/new/:userId", requireSignin, createPost);

router.get("/posts/by/:userId", requireSignin, postsByUser);

router.put("/posts/:postId", requireSignin, isPoster, updatePost);

router.delete("/posts/:postId", requireSignin, isPoster, deletePost);

router.param("userId", userById);
router.param("postId", postById);

export default router;
