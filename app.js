const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const morgan = require("morgan");
const dotenv = require("dotenv");

const app = express();
const PORT = process.env.PORT || 3500;

const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

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
