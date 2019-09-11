const Post = require("../models/post");

exports.getPosts = (req, res) => {
  Post.find()
    .select("_id title body")
    .then(posts => res.json({ posts: posts }))
    .catch(err => console.log(err));
};

exports.createPost = (req, res) => {
  const post = new Post(req.body);
  post
    .save()
    .then(() => res.json({ post: post }))
    .catch(err => res.status(400).json({ error: err }));
};
