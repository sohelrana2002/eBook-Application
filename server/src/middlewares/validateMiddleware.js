import fs from "fs/promises";

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
        ]),
      );
    }

    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    next();
  } catch (err) {
    // WHEN MULTER UPLOAD FILE THEN IF VALIDATION FAIL THEN DELETE IT
    if (req.files) {
      const filesArray = Object.values(req.files).flat();
      for (const file of filesArray) {
        try {
          await fs.unlink(file.path);
        } catch (e) {
          console.error("Cleanup error on validation failure: ", e.message);
        }
      }
    }

    // GET ERROR
    if (err.issues && err.issues.length > 0) {
      const firstIssue = err.issues[0];
      const fieldName = firstIssue.path.join(".");

      return res.status(400).json({
        success: false,
        field: fieldName,
        message: `${fieldName}: ${firstIssue.message}`,
      });
    }

    res.status(400).json({
      message: err.message || "Validation Error",
    });
  }
};

export default validate;
