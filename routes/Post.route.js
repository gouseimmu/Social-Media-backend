const express = require("express");
const { PostModel } = require("../models/Post.model");

const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
  const device=req.query
  try{
    const all_posts = await PostModel.find(device);
    res.send(all_posts);
  }catch(err){
    console.log(err)
     res.send("not able to get Posts, Something went wrong")
  }
 
});

postRouter.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const new_note = new PostModel(payload);
    await new_note.save();
    res.send("Created New Post");
  } catch (err) {
    console.log(err);
    res.send("Something went Wrong");
  }
 
});

postRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const id = req.params.id;
  const note = await PostModel.findOne({ _id: id });
  const userID_in_note = note.userID;
  const userID_making_req = req.body.userID;
  try {
    if (userID_in_note !== userID_making_req) {
      res.send({ "msg": "You are not authorized" });
    } else {
      await PostModel.findByIdAndUpdate({ _id: id }, payload);
      res.send(`Post with id ${id} is Updated`);
    }
  } catch (err) {
    console.log(err);
    res.send({ "msg": "Something Went Wrong" });
  }
});

postRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const note = await PostModel.findOne({ _id: id });
  const userID_in_note = note.userID;
  const userID_making_req = req.body.userID;
  try {
    if (userID_in_note !== userID_making_req) {
      res.send({ "msg": "You are not authorized" });
    } else {
      await PostModel.findByIdAndDelete({ _id: id });
      res.send(`Post with id ${id} is deleted`);
    }
  } catch (err) {
    console.log(err);
    res.send({ "msg": "Something Went Wrong" });
  }
});

module.exports = {
  postRouter
};

