import express from "express";
import jwtAuthMiddleware from "../middlewares/jwtAuthMiddleware.js";
import authorizedRoles from "../middlewares/authorizedRole.js";
import {
  initiatePayment,
  paymentSuccess,
} from "../controllers/payment.controller.js";

const router = new express.Router();

// initiate payment method
router.post(
  "/initiate",
  jwtAuthMiddleware,
  authorizedRoles("admin", "user"),
  initiatePayment,
);

// success payment method
router.post("/success", paymentSuccess);

export default router;
