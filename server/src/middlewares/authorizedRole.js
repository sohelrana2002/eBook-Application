const authorizedRoles = (...allParams) => {
  return (req, res, next) => {
    if (!allParams.includes(req.jwtPayload.role)) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    next();
  };
};

export default authorizedRoles;
