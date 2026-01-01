import express from "express";
import { createMessage, getDecryptMessage } from "../conrollers/messages.js";

const router = express.Router();

router.route("/encrypt").post(createMessage);
router.route("/decrypt").post(getDecryptMessage);

export default router;
