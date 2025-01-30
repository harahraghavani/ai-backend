const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { VALIDATION_RULES } = require("../../config/validationRules");
const {
  HTTP_STATUS_CODE,
  VALIDATOR,
  TOKEN_EXPIRY,
} = require("../../constant/constant");

const signup = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    let validationObject = {
      username: VALIDATION_RULES.USERS.USERNAME,
      name: VALIDATION_RULES.USERS.NAME,
      email: VALIDATION_RULES.USERS.EMAIL,
      password: VALIDATION_RULES.USERS.PASSWORD,
    };

    let validationData = {
      username,
      name,
      email,
      password,
    };

    let validation = new VALIDATOR(validationData, validationObject);

    if (validation.fails()) {
      //if any rule is violated
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: "Validation error",
        data: "",
        error: validation.errors.all(),
      });
    }

    // find weather the user exists
    let user = await User.findOne({
      username,
    });

    if (user) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: "User already exists, please login",
        data: "",
        error: "",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      name,
      email,
      password: encryptedPassword,
    });

    await newUser.save();

    return res.status(HTTP_STATUS_CODE.CREATED).json({
      status: HTTP_STATUS_CODE.CREATED,
      message: "User signed up successfully",
      data: "",
      error: "",
    });
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

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    let validationObject = {
      username: VALIDATION_RULES.USERS.USERNAME,
      password: VALIDATION_RULES.USERS.PASSWORD,
    };

    let validationData = {
      username,
      password,
    };

    let validation = new VALIDATOR(validationData, validationObject);

    if (validation.fails()) {
      //if any rule is violated
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: "Validation error",
        data: "",
        error: validation.errors.all(),
      });
    }

    // find weather the user exists
    let user = await User.findOne({
      username,
    });

    if (!user) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: "User does not exist, please signup",
        data: "",
        error: "",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: "Invalid password",
        data: "",
        error: "",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: TOKEN_EXPIRY.ACCESS_TOKEN,
      }
    );

    user.token = token;
    await user.save();

    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      message: "User logged in successfully",
      data: {
        token,
      },
      error: "",
    });
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

module.exports = { signup, login };
