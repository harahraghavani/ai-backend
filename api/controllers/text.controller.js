const bcrypt = require("bcrypt");
const TextConversion = require("../models/TextConversion");
const { HTTP_STATUS_CODE } = require("../../constant/constant");
const { generateTextResponse } = require("../helpers/google/generativeText");

const generateText = async (req, res) => {
  try {
    const userId = req.me.id;
    const { prompt, model } = req.body;
    const params = { prompt, model };

    let messages = [];
    messages.push({ isUser: true, text: prompt });

    // ------ STREAM TEXT ------
    const response = generateTextResponse({ params, res });

    messages.push({ isUser: false, text: response });

    const payload = {
      userId,
      messages,
    };
    console.log("payload: ", payload);

    return {
      status: HTTP_STATUS_CODE.OK,
      message: "Text generated successfully",
      data: payload,
      error: "",
    };

    // return res.status(HTTP_STATUS_CODE.OK).json({
    //   status: HTTP_STATUS_CODE.OK,
    //   message: "Text generated successfully",
    //   data: payload,
    //   error: "",
    // });
  } catch (error) {
    //return error response
    return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.SERVER_ERROR,
      message: "",
      data: "",
      error: error.message,
    });
  }
};

module.exports = { generateText };
