import mongoose, { mongo } from "mongoose";
import Order from "../models/order.model.js";
import { customMessage } from "../constants/customMessage.js";

// ORDER LIST (ONLY ADMIN)
const orderList = async (req, res) => {
  try {
    const { search, status, userId, fromDate, toDate, page, limit } = req.query;

    // PAGINATION FUNCTIONALITY
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const matchConditions = {};

    // STATUS FILTERING
    if (status) {
      const statusArray = status.split(",");
      matchConditions.status = { $in: statusArray };
    }

    // DATE FILTERING
    if (fromDate || toDate) {
      matchConditions.createdAt = {};

      if (fromDate) matchConditions.createdAt.$gte = new Date(fromDate);

      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        matchConditions.createdAt.$lte = end;
      }
    }

    // AGGREGATE PIPELINE SETUP
    const pipeline = [];

    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookInfo",
        },
      },
      { $unwind: "$bookInfo" },
    );

    // SEARCH FILTER FUNCTIONALITY
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      const searchConditions = [];

      // FIND BY ORDER BY
      if (mongoose.Types.ObjectId.isValid(search)) {
        searchConditions.push({ _id: new mongoose.Types.ObjectId(search) });
      }

      searchConditions.push(
        { "userInfo.name": searchRegex },
        { "userInfo.email": searchRegex },
        { "userInfo.phoneNumber": searchRegex },
        { "bookInfo.title": searchRegex },
        { "bookInfo.author": searchRegex },
      );

      matchConditions.$or = searchConditions;
    }

    // FILTER BY USERID
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      matchConditions["userInfo._id"] = new mongoose.Types.ObjectId(userId);
    }

    //   PROJECTION
    pipeline.push({
      $facet: {
        filteredMetadata: [
          { $match: matchConditions },
          { $count: "filteredTotal" },
        ],

        allMetadata: [{ $count: "total" }],

        data: [
          { $match: matchConditions },
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNumber },
          {
            $project: {
              _id: 1,
              status: 1,
              amount: 1,
              currency: 1,
              paymentGateway: 1,
              createdAt: 1,
              updatedAt: 1,

              user: {
                _id: "$userInfo._id",
                name: "$userInfo.name",
                email: "$userInfo.email",
                phoneNumber: "$userInfo.phoneNumber",
              },

              book: {
                _id: "$bookInfo._id",
                title: "$bookInfo.title",
                author: "$bookInfo.author",
                description: "$bookInfo.description",
                language: "$bookInfo.language",
                publicationDate: "$bookInfo.publicationDate",
                price: "$bookInfo.price",
                coverImage: "$bookInfo.coverImage",
                bookFile: "$bookInfo.bookFile",
              },
            },
          },
        ],
      },
    });

    const result = await Order.aggregate(pipeline);
    const orders = result[0]?.data || [];
    // console.log("orders: ", orders);
    const totalOrders = result[0]?.allMetadata[0]?.total || 0;
    const filteredOrders = result[0]?.filteredMetadata[0]?.filteredTotal || 0;

    return res.status(200).json({
      success: true,
      message: customMessage.found("All orders"),
      data: {
        orders,
        pagination: {
          filteredOrders,
          totalOrders,
          pageNumber,
          totalPage: Math.ceil(filteredOrders / limitNumber),
          limit: limitNumber,
        },
      },
    });
  } catch (error) {
    console.error("Order list error: ", error.message);

    res.status(500).json({
      success: false,
      message: customMessage.serverError(),
    });
  }
};

// ORDER INFO BY ID (ONLY ADMIN)
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
        select:
          "title author description language publicationDate price coverImage bookFile -_id",
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

// INDIVIDUAL ORDER INFO FOR USERS
const getMyOrders = async (req, res) => {
  try {
    const userId = req.jwtPayload.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const { search, status, fromDate, toDate, page, limit } = req.query;

    // PAGINATION FUNCTIONALITY
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    // INITIAL FILTER SETUP
    const initialMatch = { user: userObjectId };

    // STATUS FILTERING
    if (status) {
      const statusArray = status.split(",");
      initialMatch.status = { $in: statusArray };
    }

    // DATE FILTERING
    if (fromDate || toDate) {
      initialMatch.createdAt = {};
      if (fromDate) initialMatch.createdAt.$gte = new Date(fromDate);
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        initialMatch.createdAt.$lte = end;
      }
    }

    // POST FILTERING FOR SEARCHING
    const postLookupMatch = {};
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      postLookupMatch.$or = [
        { "bookInfo.title": searchRegex },
        { "bookInfo.author": searchRegex },
      ];
    }

    // AGGREGATE PIPELINE
    const pipeline = [
      { $match: initialMatch },

      //LOOKUP BOOK DETAILS
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookInfo",
        },
      },
      { $unwind: "$bookInfo" },

      ...(search ? [{ $match: postLookupMatch }] : []),

      {
        $facet: {
          filteredMetadata: [{ $count: "filteredTotal" }],

          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limitNumber },
            {
              $project: {
                _id: 1,
                status: 1,
                amount: 1,
                currency: 1,
                paymentGateway: 1,
                createdAt: 1,
                updatedAt: 1,
                book: {
                  _id: "$bookInfo._id",
                  title: "$bookInfo.title",
                  author: "$bookInfo.author",
                  description: "$bookInfo.description",
                  language: "$bookInfo.language",
                  publicationDate: "$bookInfo.publicationDate",
                  price: "$bookInfo.price",
                  coverImage: "$bookInfo.coverImage",
                  bookFile: {
                    $cond: {
                      if: { $eq: ["$status", "PAID"] },
                      then: "$bookInfo.bookFile",
                      else: null,
                    },
                  },
                },
              },
            },
          ],
        },
      },
    ];

    // RUN THE AGGREGATION QUERY
    const result = await Order.aggregate(pipeline);

    // TOTAL ORDERS USING USER OBJECT ID
    const totalOrders = await Order.countDocuments({ user: userObjectId });

    const orders = result[0]?.data || [];
    const filteredOrders = result[0]?.filteredMetadata[0]?.filteredTotal || 0;

    return res.status(200).json({
      success: true,
      message: customMessage.found("All orders", userId),
      data: {
        orders,
        pagination: {
          filteredOrders,
          totalOrders,
          pageNumber,
          totalPage: Math.ceil(filteredOrders / limitNumber),
          limit: limitNumber,
        },
      },
    });
  } catch (error) {
    console.error("Order info for users error: ", error.message);

    res.status(500).json({
      success: false,
      message: customMessage.serverError(),
    });
  }
};

export { orderList, orderInfoById, getMyOrders };
