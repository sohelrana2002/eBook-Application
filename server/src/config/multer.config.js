import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DEFINE PATH
const uploadPath = path.join(process.cwd(), "tmp", "uploads");

// CHECK THIS FOLDER EXIST OR NOT
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const fileValidate = (file, cb) => {
  if (file.fieldname === "coverImage") {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg, .jpeg format allowed!"));
    }
  } else if (file.fieldname === "bookFile") {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only .pdf format allowed!"));
    }
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);

    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();
    // console.log(fileName);

    cb(null, fileName + fileExt);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 2097152, //2MB
  },
  fileFilter: (req, file, cb) => {
    fileValidate(file, cb);
  },
});

export { upload };

// {
//     fieldname: 'coverImage',
//     originalname: 'Untitled design.png',
//     encoding: '7bit',
//     mimetype: 'image/png'
//   }
