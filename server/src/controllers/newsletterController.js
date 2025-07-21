import newsletterModel from "../models/newsletterModel.js";

const createNewsletter = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(500).json({
      message: "Email is required!",
    });
  }

  try {
    const emailExist = await newsletterModel.findOne({ email });

    if (emailExist) {
      return res.status(404).json({
        message: "Already subscribed!",
      });
    }

    await newsletterModel.create({ email });
    res.status(201).json({
      message: "Subscribed successfully!",
    });
  } catch (err) {
    console.error("Internal server error", err);

    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

export { createNewsletter };
