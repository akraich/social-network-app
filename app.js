import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import morgan from "morgan";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 5000;

import postRoutes from "./post/post.router";
import authRoutes from "./auth/auth.router";
import userRoutes from "./user/user.router";

dotenv.config();

mongoose.set("useUnifiedTopology", true);
mongoose.set("useNewUrlParser", true);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected successfully to database"));

mongoose.connection.on("error", error =>
  console.log(`Something went wrong ${error.message}`)
);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use(postRoutes);
app.use(authRoutes);
app.use(userRoutes);

app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: "Unauthorized!" });
  }
});

app.listen(PORT, () => {
  console.log(`Connected successfully on port: ${PORT}`);
});
