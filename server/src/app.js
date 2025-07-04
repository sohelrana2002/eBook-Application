import express from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import authRouter from "./routers/authRouter.js";
import bookRouter from "./routers/bookRouter.js";
import reviewRouter from "./routers/reviewRouter.js";
import filterRouter from "./routers/filterRouter.js";
import bookRequestRouter from "./routers/bookRequestRouter.js";

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3001",
  "https://e-book-application-five.vercel.app",
];

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
app.use("/api/filter", filterRouter);
app.use("/api", reviewRouter);
app.use("/api/bookRequest", bookRequestRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Backend is working",
  });
});

// ------global error handler middleware ----
app.use(globalErrorHandler);

export default app;
