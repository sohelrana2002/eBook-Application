import mongoose from "mongoose";
import Order from "../models/order.model.js";
import { customMessage } from "../constants/customMessage.js";

const orderInfoById = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(409).json({
        success: false,
        message: customMessage.invalidId("Mongoose", orderId),
      });
    }

    const orderData = await Order.findById(orderId).populate([
      {
        path: "user",
        select: "name email phoneNumber -_id",
      },
      {
        path: "book",
        select: "title author description language publicationDate price -_id",
      },
    ]);

    if (!orderData) {
      return res.status(409).json({
        success: false,
        message: customMessage.notFound("Order", orderId),
      });
    }

    return res.status(200).json({
      success: true,
      message: customMessage.found("Order", orderId),
      data: { orderData },
    });
  } catch (error) {
    console.error("Order info by ID error: ", error.message);

    res.status(500).json({
      success: false,
      message: customMessage.serverError(),
    });
  }
};

export { orderInfoById };
