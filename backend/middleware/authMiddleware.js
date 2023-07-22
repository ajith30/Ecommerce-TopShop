import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";
import jwt from "jsonwebtoken";

//User must be authorized / logged in
const protect = asyncHandler(async(req, res, next) => {
  let token;

  //Read JWT from the "jwt" cookie
  token = req.cookies.jwt;

  if(token) {
    try {
      //token exist get the user id from the token by decoding using jwt.verify()
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //using the userId, fetching the user details document without password and assinging to user Obj which is assigned to req Obj
      // So that all routes req has user Obj
      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token")
  }
});

// Note: Above try..catch() usedto handle the error specifically related to token verification using jwt.verify().
// Even though the asyncHandler middleware catches general errors within the route handler, it may not catch errors related to 
// specific operations, such as token verification in this case.


//User must be admin (For accessing routes based on the role)
const admin = (req, res, next) => {
  if(req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
}

export {protect, admin};