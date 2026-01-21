import express from "express";

const bookAssistantRouter = new express.Router();
import { createBookAssistant } from "../controllers/bookAssistant.js";

bookAssistantRouter.route("/").post(createBookAssistant);

export default bookAssistantRouter;
