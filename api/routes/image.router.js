const express = require("express");
const { isUser } = require("../policies/isUser");
const {
  generateImage,
  getImages,
  deleteImage,
} = require("../controllers/image.controller");

const imageRouter = express.Router();

imageRouter.post("/generate-image", [isUser], generateImage);
imageRouter.get("/get-images", [isUser], getImages);
imageRouter.delete("/delete-image/:id", [isUser], deleteImage);

module.exports = imageRouter;
