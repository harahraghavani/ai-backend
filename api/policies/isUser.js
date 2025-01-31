const { JWT, HTTP_STATUS_CODE } = require("../../constant/constant");
const User = require("../models/User");

const isUser = async (req, res, next) => {
  try {
    //getting authToken from headers
    let authToken = req.headers["authorization"];

    //check if authToken starts with Bearer, fetch the token or return error
    if (authToken && authToken.startsWith("Bearer ")) {
      //if token start with Bearer
      authToken = authToken.split(" ")[1];
    } else {
      //if token is not provided then send validation response
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
        errorCode: "",
        message: "Token not found",
        data: "",
        error: "",
      });
    }

    //verify jwt token based on jwt key
    let decodedToken = await JWT.verify(authToken, process.env.JWT_KEY);

    if (
      decodedToken &&
      decodedToken.exp &&
      decodedToken.exp > Math.floor(Date.now() / 1000)
    ) {
      if (decodedToken.id) {
        let user = await User.findOne({
          _id: decodedToken.id,
        });

        if (!user) {
          //if user is not found in database then send validation response
          return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
            status: HTTP_STATUS_CODE.UNAUTHORIZED,
            errorCode: "",
            message: "User not found",
            data: "",
            error: "",
          });
        }

        /* checks token from header with current token stored in database for that user
          if that doesn't matches then send validation response */
        // if (user.token !== authToken) {
        //   return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        //     status: HTTP_STATUS_CODE.UNAUTHORIZED,
        //     errorCode: "",
        //     message: "Token mismatched",
        //     data: "",
        //     error: "",
        //   });
        // }
        req.me = user;
        next();
      } else {
        return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
          status: HTTP_STATUS_CODE.UNAUTHORIZED,
          errorCode: "",
          message: "User not found",
          data: "",
          error: "",
        });
      }
    } else {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
        errorCode: "",
        message: "Token is expired",
        data: "",
        error: "",
      });
    }
  } catch (error) {
    //if error is of jwt token expire then send validation response with errorcode 'AUTH004'
    if (error instanceof JWT.TokenExpiredError) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
        errorCode: "",
        message: "Token is expired",
        data: "",
        error: "",
      });
    } else {
      //send server error response
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: "",
        data: "",
        error: error.message,
      });
    }
  }
};

module.exports = { isUser };
