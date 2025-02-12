const validate = (schema) => async (req, res, next) => {
  try {
    if (
      req.is("multipart/form-data") ||
      req.is("application/x-www-form-urlencoded")
    ) {
      // Handle form-data specific preprocessing
      req.body = Object.fromEntries(
        Object.entries(req.body).map(([key, value]) => [
          key,
          Array.isArray(value) ? value : value.toString(),
        ])
      );
    }

    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    next();
  } catch (err) {
    // console.log(err);
    res.status(400).json({
      message: err?.issues?.[0]?.message,
    });
  }
};

export default validate;
