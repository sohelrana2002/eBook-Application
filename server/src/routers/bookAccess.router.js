import express from "express";
import jwtAuthMiddleware from "../middlewares/jwtAuthMiddleware.js";
import authorizedRoles from "../middlewares/authorizedRole.js";
import {
  checkBookAccess,
  downloadBook,
} from "../controllers/bookAccess.controller.js";

const router = new express.Router();

// check access
router.get(
  "/:bookId/access",
  jwtAuthMiddleware,
  authorizedRoles("admin", "user"),
  checkBookAccess,
);

// download book
router.get(
  "/:bookId/download",
  jwtAuthMiddleware,
  authorizedRoles("admin", "user"),
  downloadBook,
);

export default router;
