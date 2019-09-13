import fs from "fs";
import formidable from "formidable";

import Post from "../post/post.model";

export const postById = (req, res, next, id) => {
  Post.find(id)
    .populate("postedBy", "_id, name")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({ message: "Post not found" });
      }
      req.post = post;
      next();
    });
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "_id name")
      .select("_id title body")
      .exec();
    if (!posts) {
      return res.status(404).end();
    }
    res.json({ data: posts });
  } catch (err) {
    console.log(err);
  }
};

export const createPost = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse((err, fields, files) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "File uploading encountered an error" });
    }
    const post = new Post(fields);
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    post.postedBy = req.profile;
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
      post.save((err, result) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "You are not authorized to perform this action" });
        }
        res.json(result);
      });
    }
  });
};

export const postsByUser = (req, res) => {
  Post.find({ postedBy: req.profile })
    .populate("postedBy", "_id name")
    .sort("created")
    .exec((err, posts) => {
      if (err) {
        if (err) {
          return res
            .status(400)
            .json({ message: "You are not authorized to perform this action" });
        }
      }
      res.json(posts);
    });
};

export const isPoster = (req, res, next) => {
  const isPoster =
    req.post && req.auth && req.post.postedBy._id == req.auth._id;

  if (!isPoster) {
    return res
      .status(403)
      .json({ message: "User is not authorized to perform this action" });
  }
  next();
};

export const updatePost = (req, res) => {
  let post = req.post;
  post = _.extend(post, req.body);
  post.updated = Date.now();
  post.save(err => {
    if (err) {
      return res.status(400).json({
        message: "You are not authorized to perform this action"
      });
    }
    res.json(post);
  });
};

export const deletePost = (req, res) => {
  let post = req.post;
  post.remove(err => {
    if (err) {
      return res.status(400).json({
        message: "You are not authorized to perform this action"
      });
    }
    res.json({ message: "Post deleted successfully" });
  });
};
