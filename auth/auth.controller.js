import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import dotenv from "dotenv";

import User from "../user/user.model";

dotenv.config();

export const signup = async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists)
      return res.status(403).json({ data: "Email is already taken" });
    const user = await User.create(req.body);
    res.status(200).json({ data: "User registered successfully" });
  } catch (err) {
    console.log(err);
  }
};

export const signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        message: "User with that email does not exist, Please signup"
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        message: "Email and password do not match"
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
    res.cookie("t", token, { expire: new Date() + 10000 });
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, name, email } });
  });
};

export const signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "You signed out" });
};

export const requireSignin = expressJwt({
  secret: process.env.SECRET_TOKEN,
  userProperty: "auth"
});
