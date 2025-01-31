const VALIDATOR = require("validatorjs");
const JWT = require("jsonwebtoken");

// Response Codes
const HTTP_STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  SERVER_ERROR: 500,
};

// JWT Expiry
const TOKEN_EXPIRY = {
  ACCESS_TOKEN: "1d",
  FORGOT_PASSWORD_TOKEN: 60 * 60, // 1 hour
};

module.exports = { HTTP_STATUS_CODE, VALIDATOR, TOKEN_EXPIRY, JWT };
