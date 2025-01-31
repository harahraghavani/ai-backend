const express = require("express");
const {
  signup,
  login,
  logout,
  checkUsername,
} = require("../controllers/auth.controller");
const { isUser } = require("../policies/isUser");

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/check-username", checkUsername);
authRouter.post("/logout", [isUser], logout);

module.exports = authRouter;
