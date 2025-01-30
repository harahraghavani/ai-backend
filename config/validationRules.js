const { PASSWORD_REGEX } = require("../constant/regex");

const VALIDATION_RULES = {
  USERS: {
    ID: "required|string",
    USERNAME: "required|string",
    NAME: "required|string",
    EMAIL: "required|string|email",
    PASSWORD: [
      "required",
      "string",
      "min:8",
      "max:16",
      `regex:${PASSWORD_REGEX}`,
    ],
  },
};

module.exports = { VALIDATION_RULES };
