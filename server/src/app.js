import express from "express";
import cors from "cors";
import passport from "passport";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import authRouter from "./routers/auth.router.js";
import bookRouter from "./routers/book.router.js";
import reviewRouter from "./routers/review.router.js";
import filterRouter from "./routers/filter.router.js";
import bookRequestRouter from "./routers/bookRequest.router.js";
import featuredBookRouter from "./routers/featuredBook.router.js";
import newsletterRouter from "./routers/newsletter.router.js";
import contactRouter from "./routers/contact.router.js";
import { JSONrouter } from "./controllers/json.controller.js";
import googleRouter from "./routers/google.router.js";
import bookAssistantRouter from "./routers/bookAssistant.router.js";

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3001",
  "https://e-book-application-five.vercel.app",
  "https://e-book-application-admin.vercel.app",
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
app.use(passport.initialize());

// all route
app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);
app.use("/api/filter", filterRouter);
app.use("/api", reviewRouter);
app.use("/api/bookRequest", bookRequestRouter);
app.use("/api/featured-book", featuredBookRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/contact", contactRouter);
app.use("/api/json", JSONrouter);
app.use("/api/auth", googleRouter);
app.use("/api/assistant", bookAssistantRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Backend is working",
  });
});

// ------global error handler middleware ----
app.use(globalErrorHandler);

export default app;
