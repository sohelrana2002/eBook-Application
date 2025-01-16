import mongoose from "mongoose";
import { config } from "./config.js";

const connectDatabase = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Successfully connected to te database.");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Error in connecting database.", err);
    });

    await mongoose.connect(config.databaseURI);
  } catch (error) {
    console.error("Database connection error.", error);
    process.exit(1);
  }
};

export default connectDatabase;
