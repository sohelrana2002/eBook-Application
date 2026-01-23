import SSLCommerzPayment from "sslcommerz-lts";
import { config } from "../config/config.js";
import Book from "../models/book.model.js";
import Order from "../models/order.model.js";
import User from "../models/auth.model.js";

const store_id = config.SSL_store_id;
const store_password = config.SSL_store_password;
const is_live = false;

// initiate payment method
const initiatePayment = async (req, res) => {
  try {
    const { bookId } = req.body;
    const user = req.jwtPayload;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found.",
      });
    }

    // check the user already buy this book
    const userDoc = await User.findById(user.userId).select("purchasedBooks");

    if (userDoc.purchasedBooks.includes(book._id)) {
      return res.status(400).json({
        success: false,
        message: "You already buy this book!",
      });
    }

    // check if payment alreday exist
    let order = await Order.findOne({
      user: user.userId,
      book: book._id,
      status: { $in: ["PENDING", "PAID"] },
    });

    if (order && order.status === "PAID") {
      return res.status(400).json({
        success: false,
        message: "You already purchased this book.",
      });
    }

    if (!order) {
      order = await Order.create({
        user: user.userId,
        book: book._id,
        amount: book.price,
        paymentGateway: "SSLCOMMERZ",
        status: "PENDING",
      });
    }

    const data = {
      total_amount: book.price,
      currency: "BDT",
      tran_id: order._id.toString(),
      success_url: `${config.frontEndBaseURL}/payment-success?tran_id=${order._id}`,
      fail_url: `${config.backEndBaseURL}/api/payment/fail`,
      cancel_url: `${config.backEndBaseURL}/api/payment/cancel`,
      product_name: book.title,
      cus_name: user.name,
      cus_email: user.email,
      cus_phone: user.phone,
      shipping_method: "NO",
      product_category: "Ebook",
      product_profile: "digital",
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",

      // Shipping info (required but can mirror customer)
      ship_name: user.name || "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: "1000",
      ship_country: "Bangladesh",
    };

    const sslcz = new SSLCommerzPayment(store_id, store_password, is_live);
    const apiResponse = await sslcz.init(data);
    // console.log("apiResponse", apiResponse);

    res.json({
      paymentUrl: apiResponse.GatewayPageURL,
    });
  } catch (error) {
    console.log("initiate payment error.", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// success payment method
const paymentSuccess = async (req, res) => {
  try {
    const { tran_id, bank_tran_id } = req.body;

    const order = await Order.findById(tran_id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // prevent double execution
    if (order.status === "PAID") {
      return res.redirect(`${config.frontEndBaseURL}/payment-success`);
    }

    order.status = "PAID";
    order.transactionId = bank_tran_id;
    await order.save();

    await User.updateOne(
      { _id: order.user },
      { $addToSet: { purchasedBooks: order.book } },
    );

    // respond with HTML that redirects the browser
    res.send(`
      <html>
        <body>
          <h1>Payment Successful!</h1>
          <script>
            window.location.href = "${config.frontEndBaseURL}/payment-success";
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("payment success error: ", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { initiatePayment, paymentSuccess };
