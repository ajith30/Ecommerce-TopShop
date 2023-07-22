import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({email});

    if(userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
//Note: Above the "return" statement is not necessary after throwing an error. The throw statement will cause an immediate exit from the function,
//so the subsequent code will not be executed. The return statement in that specific context is not needed and can be omitted.

    const user = await User.create({
      name,
      email,
      password  //pasword will be hased and stored in DB. Which is handled in User model
    });

    if(user) {
      generateToken(res, user._id);

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      })
    }

    res.status(400);
    throw new Error('Invaild user data');
});


// @desc     Login User / Auth user & get token
// @route    POST /api/users/login
// @access   Public
const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  //find the user
  const user = await User.findOne({ email });

  //check if user exist & entered password matching with DB Password.
  if(user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });
  }
  res.status(401);
  throw new Error("Invalid email or password");
});

// @desc     Logout User / clear token
// @route    POST /api/users/login
// @access   Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Get user Profile
// @route   PUT /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if(user) {
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });
  }

  res.status(404);
  throw new Error("User not found");
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if(user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if(req.body.password) {
      user.password = req.body.password;
    }

    const updateUser = await user.save();

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });
  }

  res.status(404);
  throw new Error("User not found")
})



// @desc    Get all users
// @route   GET /api/users
// @access  Private/admin
const getUsers = asyncHandler(async (req, res) => {
  res.send("Get all users");
});

// @desc    Get user by Id
// @route   GET /api/users/:id
// @access  Private/admin
const getUserById = asyncHandler(async (req, res) => {
  res.send("Get user by Id");
});

// @desc    Update User by Id
// @route   GET /api/users/:id
// @access  Private/admin
const updateUser = asyncHandler(async (req, res) => {
  res.send("Update user");
});

// @desc    Delete user by Id
// @route   DELETE /api/users/:id
// @access  Private/admin
const deleteUser = asyncHandler(async (req, res) => {
  res.send("Delete user");
});


export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
}