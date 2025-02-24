import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import authRouter from "./routers/authRouter.js";
import bookRouter from "./routers/bookRouter.js";
import reviewRouter from "./routers/reviewRouter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);
app.use("/api", reviewRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

// ------global error handler middleware ----
app.use(globalErrorHandler);

export default app;
