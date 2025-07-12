import booksModel from "../models/bookModel.js";

const featuredBook = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 12; // ?limit=12

    const [result] = await booksModel
      .aggregate([
        {
          $facet: {
            oscarBook: [
              { $match: { isOscar: true } },
              { $sort: { created_at: -1 } },
              { $limit: limit },
            ],
            novelBook: [
              { $match: { isNovel: true } },
              { $sort: { created_at: -1 } },
              { $limit: limit },
            ],
            shortStoryBook: [
              { $match: { isShortStory: true } },
              { $sort: { created_at: -1 } },
              { $limit: limit },
            ],
            poetryBook: [
              { $match: { isPoetry: true } },
              { $sort: { created_at: -1 } },
              { $limit: limit },
            ],
            kidsBook: [
              { $match: { isKidsBook: true } },
              { $sort: { created_at: -1 } },
              { $limit: limit },
            ],
          },
        },
      ])
      .exec();

    res.status(200).json({ message: "success", ...result });
  } catch (err) {
    console.log(err, "error from server");

    res.status(500).json({
      message: "internal server error",
      error: err,
    });
  }
};

export { featuredBook };
