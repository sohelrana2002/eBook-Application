import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import authRouter from "./routers/authRouter.js";
import bookRouter from "./routers/bookRouter.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

// ------global error handler middleware ----
app.use(globalErrorHandler);

export default app;
