import { Router } from "express";
import jwtAuthMiddleware from "../middlewares/jwtAuthMiddleware.js";
import authorizedRoles from "../middlewares/authorizedRole.js";
import {
  getMyOrders,
  getPurchasedBooks,
  orderInfoById,
  orderList,
} from "../controllers/order.controller.js";

const router = Router();

// ORDER LIST (ONLY ADMIN)
router.get("/", jwtAuthMiddleware, authorizedRoles("admin"), orderList);

// INDIVIDUAL ORDER INFO FOR USERS
router.get(
  "/my-orders",
  jwtAuthMiddleware,
  authorizedRoles("admin", "user"),
  getMyOrders,
);

// USERS PURCHASHED BOOKS
router.get(
  "/purchased-books",
  jwtAuthMiddleware,
  authorizedRoles("admin", "user"),
  getPurchasedBooks,
);

// ORDER INFO BY ID (ONLY ADMIN)
router.get("/:id", jwtAuthMiddleware, authorizedRoles("admin"), orderInfoById);

export default router;
