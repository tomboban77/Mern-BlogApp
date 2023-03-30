const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../model/user/User");

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        //Find the user by Id
        const user = await User.findById(decoded?.id).select("-password");

        //Append the id to the req object.
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not authorized, please login again");
    }
  } else {
    throw new Error("There is no token attached to header");
  }
});
module.exports = authMiddleware;
