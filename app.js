const authRouter = require("./api/routes/auth.router");

try {
  // Load environment variables
  require("dotenv").config();

  // Load modules
  const express = require("express");
  const cors = require("cors");
  const mongoose = require("mongoose");

  // express app
  const EXPRESS_APP = express();

  // DB Connection Url
  const dbURL = process.env.DB_URL;

  // connect to mongodb
  mongoose.connect(dbURL);
  const connection = mongoose.connection;

  try {
    connection.once("open", () => {
      console.log("MongoDB database connection established successfully");
    });
  } catch (error) {
    console.log("Error: ", error);
  }

  // Cors Setup
  EXPRESS_APP.use(cors());
  EXPRESS_APP.use(express.json());

  // Routes
  EXPRESS_APP.use("/api/auth", authRouter);

  // App Listen
  EXPRESS_APP.listen(process.env.PORT);
} catch (error) {
  throw error;
}
