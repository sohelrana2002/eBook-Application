// upload pure json file in database

import express from "express";
const JSONrouter = express.Router();
import fs from "fs";
import path from "path";
import booksModel from "../models/bookModel.js";

JSONrouter.post("/import-books", async (req, res) => {
  try {
    const dataPath = "E:/eBook-Application/server/public/books.json"; // adjust path as needed
    const jsonData = fs.readFileSync(dataPath, "utf-8");
    const books = JSON.parse(jsonData);

    await booksModel.insertMany(books);

    res
      .status(200)
      .json({ message: "Books imported successfully", count: books.length });
  } catch (err) {
    console.error("Error importing books:", err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

export { JSONrouter };
