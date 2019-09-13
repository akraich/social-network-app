import express from "express";

const router = express.Router();

import { signup, signin, signout } from "./auth.controller";

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);

module.exports = router;
