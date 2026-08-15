import { Router } from "express";
import jwtAuthMiddleware from "../middlewares/jwtAuthMiddleware.js";
import authorizedRoles from "../middlewares/authorizedRole.js";
import { orderInfoByIdOnlyAdmin } from "../controllers/order.controller.js";

const router = Router();

// order info by ID
router.get(
  "/:id/admin",
  jwtAuthMiddleware,
  authorizedRoles("admin"),
  orderInfoByIdOnlyAdmin,
);

export default router;
