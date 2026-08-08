import user from "../models/auth.model.js";

const authorizedRoles = (...allParams) => {
  return async (req, res, next) => {
    const userId = req.jwtPayload?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. No user ID found.",
      });
    }

    const userRole = await user.findById(userId).select("role");

    if (!userRole) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (!allParams.includes(userRole.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    next();
  };
};

export default authorizedRoles;
