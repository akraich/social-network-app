const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const dotenv = require("dotenv");

const User = require("../models/user");

dotenv.config();

exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res.status(403).json({ message: "Email is already taken" });
  const user = new User(req.body);
  await user.save();
  res.status(200).json({ message: "User registered successfully" });
};

exports.signin = (req, res) => {
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

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "You signed out" });
};

exports.requireSignin = expressJwt({
  secret: process.env.SECRET_TOKEN,
  userProperty: "auth"
});
