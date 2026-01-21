import express from "express";
import jwtAuthMiddleware from "../middlewares/jwtAuthMiddleware.js";
import authorizedRoles from "../middlewares/authorizedRole.js";
import { createOrder } from "../controllers/order.controller.js";

const router = new express.Router();

router.post(
  "/initiate",
  jwtAuthMiddleware,
  authorizedRoles("admin", "user"),
  createOrder,
);
