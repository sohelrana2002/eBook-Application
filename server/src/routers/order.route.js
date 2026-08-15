import { Router } from "express";
import jwtAuthMiddleware from "../middlewares/jwtAuthMiddleware.js";
import authorizedRoles from "../middlewares/authorizedRole.js";
import { orderInfoById } from "../controllers/order.controller.js";

const router = Router();

// ORDER LIST
router.get("/", jwtAuthMiddleware, authorizedRoles("admin", orderList));

// ORDER INFO BY ID (ONLY ADMIN)
router.get("/:id", jwtAuthMiddleware, authorizedRoles("admin"), orderInfoById);

export default router;
