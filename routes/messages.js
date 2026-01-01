import express from "express";
import { createProduct, getProducts } from "../conrollers/users.js";

const router = express.Router();

router.route("/").post(createProduct).get(getProducts);

export default router;
