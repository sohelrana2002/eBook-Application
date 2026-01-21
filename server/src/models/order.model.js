import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: ture,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    amount: {
      type: Number,
    },

    currency: {
      type: String,
      default: "BDT",
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    transactionId: {
      type: String,
    },

    paymentGateway: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Order", orderSchema);
