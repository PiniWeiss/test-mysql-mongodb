import express from "express";
import { createUser} from "../conrollers/users.js";

const router = express.Router();

router.route("/register").post(createUser)//.get(getOrders)

export default router;
