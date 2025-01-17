import { config } from "../config/config.js";

const globalErrorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    message: error.message,
    errorStack: config.errorStackEnv === "development" ? error.stack : "",
  });
};

export default globalErrorHandler;
