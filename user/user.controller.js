import _ from "lodash";
import User from "./user.model";

export const userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: "User not found" });
    }
    req.profile = user;
    next();
  });
};

export const hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.auth && req.profile._id === req.auth._id;

  if (!authorized) {
    return res
      .status(403)
      .json({ message: "User is not authorized to perform this action" });
  }
  next();
};

export const allUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        message: err
      });
    }
    res.json({ users });
  }).select("name email created updated");
};

export const getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  res.json(req.profile);
};

export const updateUser = (req, res) => {
  let user = req.profile;
  user = _.extend(user, req.body);
  user.updated = Date.now();
  user.save(err => {
    if (err) {
      return res.status(400).json({
        message: "You are not authorized to perform this action"
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json({ user });
  });
};

export const deleteUser = (req, res) => {
  let user = req.profile;
  user.remove(err => {
    if (err) {
      return res.status(400).json({
        message: "You are not authorized to perform this action"
      });
    }
    res.json({ message: "User deleted successfully" });
  });
};
