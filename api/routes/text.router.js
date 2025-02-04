const express = require("express");
const { isUser } = require("../policies/isUser");
const { generateText } = require("../controllers/text.controller");

const textRouter = express.Router();

textRouter.post("/generate-text", [isUser], generateText);

module.exports = textRouter;
