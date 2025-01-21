import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const jwtAuthMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: "Token not found",
    });
  }

  // ===extract jwt token from headers===
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized user.",
    });
  }

  try {
    //   ===verify jwt tojken===
    const decoded = jwt.verify(token, config.jwtSecretKey);

    req.jwtPayload = decoded;
    next();
  } catch (err) {
    console.error("jwt token error.");

    res.status(500).json({
      message: "jwt token error.",
      error: err,
    });
  }
};

export default jwtAuthMiddleware;
