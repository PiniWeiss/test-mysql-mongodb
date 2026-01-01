import express from "express";
import { createUser, getUser } from "../conrollers/users.js";

const router = express.Router();

router.route("/register").post(createUser);
router.route("/me").get(getUser);

export default router;
