import express from "express";

const router = express.Router();

import {
  getUser,
  userById,
  updateUser,
  deleteUser,
  allUsers
} from "./user.controller";
import { requireSignin } from "../auth/auth.controller";

router.get("/users", allUsers);
router.get("/users/:userId", requireSignin, getUser);
router.put("/users/:userId", requireSignin, updateUser);
router.delete("/users/:userId", requireSignin, deleteUser);

router.param("userId", userById);

export default router;
