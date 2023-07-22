import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  //creating token
  const token = jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });

  //Set JWT as an HTTP-Only cookie (storing the token in cookie insted of localStorage)
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", //secure cookie in production environment
    sameSite: "strict",  //Prevent CSRF attacks
    maxAge: 60 * 60 * 1000,  // 1 hour in milliseconds
  });
}

export default generateToken;