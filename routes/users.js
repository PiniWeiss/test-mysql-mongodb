import express from "express";
import { createOrder, getOrders} from "../conrollers/messages.js";

const router = express.Router();

router.route("/").post(createOrder).get(getOrders)

export default router;
