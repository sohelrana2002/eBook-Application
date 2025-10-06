import contact from "../models/contactModel.js";

const createContact = async (req, res) => {
  const { message, email } = req.body;

  try {
    const emailExist = await contact.findOne({ email });

    if (emailExist) {
      return res.status(500).json({
        message: "This email is already provide message!",
      });
    }

    const contactData = new contact({
      userId: req.jwtPayload.userId,
      name: req.jwtPayload.name,
      email,
      message,
    });

    await contactData.save();

    res.status(201).json({ message: "Message submitted successfully" });
  } catch (error) {
    console.error("Create contact info error.", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { createContact };
