import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import router from "./routers/authRouter.js";

const app = express();

app.use(express.json());

app.use("/api/auth", router);

app.get("/", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

// ------global error handler middleware ----
app.use(globalErrorHandler);

export default app;
