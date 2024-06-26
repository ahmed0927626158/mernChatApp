import User from "../models/user.model.js";
import jwt from "jsonwebtoken"
import generatToken from "../utils/generateToken.js";
export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirm, phone, gender } =
      req.body;
    if (
      !fullName ||
      !username ||
      !password ||
      !phone ||
      !confirm ||
      !gender
    ) {
      return res.status(400).json({ error: "please fill all the fields" });
    }
    if (password !== confirm) {
      return res.status(400).json({ error: "passwords do not match" });
    }
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "username already exists" });
    }
    const boyProfile = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girleProfile = `https://avatar.iran.liara.run/public/girle?username=${username}`;
    const newUser = new User({
      fullName,
      username,
      password,
      phone,
      gender,
      profilePic: gender === "male" ? boyProfile : girleProfile,
    });
    if (newUser) {
      generatToken(newUser._id, res);
      await newUser.save();
      res.status(200).json({
        id: newUser._id,
        fullName: newUser.fullName,
        usename: newUser.username,
        phone: newUser.phone,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ error: "something went wrong" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error","message":error });
  }
};

export const login = async (req, res) => {
   const { username, password } = req.body;
  
  try {
    // check if user exists
    const user = await User.findOne({ username });
   
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    //check the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    generatToken(user._id, res);
    res.setHeader('Access-Control-Allow-Credentials', 'true');


    return res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      usename: user.username,
      phone: user.phone,
      profilePic: user.profilePic,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server Error","message1":error });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Lout successfull" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error","message":error });
  }
};
