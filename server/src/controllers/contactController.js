import contact from "../models/contactModel.js";

const createContact = async (req, res) => {
  const { message, email } = req.body;

  try {
    if (!email) {
      return res.status(404).json({
        message: "Email is required!",
      });
    }
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const contactData = new contact({
      userId: req.jwtPayload.userId,
      name: req.jwtPayload.name,
      email,
      message,
    });

    await contactData.save();

    res.status(201).json({ message: "Message submitted successfully" });
  } catch (err) {
    console.log(err, "error from server");

    res.status(500).json({
      message: "internal server error",
      error: err,
    });
  }
};

export { createContact };
