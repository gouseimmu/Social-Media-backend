const express = require("express");
const { connection } = require("./configs/db");
const cors = require("cors");
const {userRouter}=require("./routes/user.route");
const {authenticate}=require("./middlewares/authentication.middleware");
const {postRouter}=require("./routes/posts.route")
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use("/users", userRouter)
app.use(authenticate)
app.use("/posts", postRouter)

app.get("/", (req, res) => {
  res.send("Welcome to HomePage");
});



app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to the DB");
  } catch (err) {
    console.log("Error While Connect to the DB");
    console.log(err);
  }

  console.log(`Server is running on Port ${process.env.port}`);
});
