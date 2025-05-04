import express from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import authRouter from "./routers/authRouter.js";
import bookRouter from "./routers/bookRouter.js";
import reviewRouter from "./routers/reviewRouter.js";

const app = express();
const allowedOrigins = ["http://localhost:5173", "http://localhost:3001"];

// var corsOptions = {
//   origin: "http://localhost:5173" || "http://localhost:3001",
//   methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
//   credentials: true,
//   // optionsSuccessStatus: 200
// };

var corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
  // optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

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
