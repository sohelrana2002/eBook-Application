import user from "../models/authModel.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

// ====register users===
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExist = await user.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        message: "email already exists",
      });
    }

    const createUser = await user.create({
      name,
      email,
      password,
      role,
    });

    // console.log(createUser);
    res.status(201).json({
      message: "user register Successfull",
      token: await createUser.generateToken(),
      userId: createUser._id.toString(),
    });
  } catch (err) {
    res.status(500).json({
      message: "internal server error",
      error: err,
    });
  }
};

// ====login users===
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userExist = await user.findOne({ email });
    // console.log(userExist, "userExist");

    if (!userExist) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const isPasswordValid = await userExist.comparePassword(password);

    // console.log(isPasswordValid, "isPasswordValid");
    if (isPasswordValid) {
      return res.status(200).json({
        message: "Successfully login",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
        name: userExist.name,
      });
    } else {
      res.status(400).json({
        message: "Invalid email or password",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

// update profile information
const updateProfile = async (req, res) => {
  try {
    const { name, phoneNumber, bio, location, language } = req.body;
    const userId = req.jwtPayload.userId;

    const request = await user.findByIdAndUpdate(
      userId,
      { name, phoneNumber, bio, location, language },
      { new: true }
    );

    if (!request) {
      res.status(404).json({
        message: "User not found!",
      });
    }

    // console.log("request", request);

    res.status(202).json({
      message: "User information updated successfully!",
      id: request._id,
    });
  } catch (err) {
    console.log("Internal server error", err);

    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

// ===get all users information===
const getUserInfo = async (req, res, next) => {
  try {
    const userInfo = await user.find({ role: "user" });

    if (!userInfo) {
      return res.status(404).json({
        message: "Users not found.",
      });
    } else {
      return res.status(201).json({
        message: "Users founds successfully.",
        length: userInfo.length,
        users: userInfo,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

// ===get all admin information===
const getAdminInfo = async (req, res, next) => {
  try {
    const adminInfo = await user.find({ role: "admin" });

    if (!adminInfo) {
      return res.status(404).json({
        message: "admin not found.",
      });
    } else {
      return res.status(201).json({
        message: "admin founds successfully.",
        length: adminInfo.length,
        users: adminInfo,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

// ===individual profile information===
const userProfile = async (req, res, next) => {
  try {
    const userData = req.jwtPayload;
    // console.log(userData);

    const userId = userData.userId;

    const profileDetails = await user.findById(userId);
    // console.log(profileDetails);

    if (profileDetails) {
      return res.status(200).json({
        message: "success.",
        userProfile: profileDetails,
      });
    } else {
      return res.status(401).json({
        message: "failed.",
        error: "invalid token",
      });
    }
  } catch (err) {
    console.error("Internal server error.");

    res.status(500).json({
      message: "Internal server error.",
      error: err,
    });
  }
};

// ===delete user from admin access====
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    // console.log("userId", userId);

    const userExist = await user.findOne({ _id: userId });

    if (!userExist) {
      return res.status(404).json({
        message: "User not found!",
      });
    } else {
      await user.deleteOne({ _id: userId });

      res.status(200).json({
        message: "User deleted succesfully.",
        id: userId,
      });
    }
  } catch (err) {
    console.log("Internal server error", err);

    res.status(500).json({
      message: "Internal server error.",
      error: err,
    });
  }
};

// ======forgot password ====
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const userExist = await user.findOne({ email });

  if (!userExist) return res.status(404).json({ message: "User not found" });

  const token = jwt.sign({ userId: userExist._id }, config.jwtSecretKey, {
    expiresIn: "15m",
  });

  const resetLink = `http://localhost:3000/api/auth/reset-password/${token}`;

  // In real life: send email with resetLink
  console.log("Password reset link:", resetLink);

  res.json({ message: "Reset link sent to email (simulated)" });
};

// =====reset password==========
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, config.jwtSecretKey);
    console.log("decoded", decoded);

    const userExist = await user.findById(decoded.userId);

    if (!userExist) return res.status(404).json({ message: "User not found" });

    userExist.password = newPassword;
    await userExist.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

export {
  register,
  login,
  getUserInfo,
  userProfile,
  getAdminInfo,
  deleteUser,
  forgotPassword,
  resetPassword,
  updateProfile,
};
