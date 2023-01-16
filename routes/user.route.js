const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user.model")
require("dotenv").config()

const userRouter=express.Router()

userRouter.post("/register", async (req, res) => {
    const { email, password, name, gender } = req.body;
    try {
      bcrypt.hash(password, 5, async (err, secure_password) => {
       
        if (err) {
          console.log(err);
        } else {
          const user = new UserModel({ email, password: secure_password, name, gender });
          await user.save();
          res.send("Registeration done");
        }
      });
    } catch (err) {
      res.send("Error in Registeration ");
      console.log(err);
    }
  });
  

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
     
      const user = await UserModel.find({ email });
       
      if (user.length > 0) {
        bcrypt.compare(password, user[0].password, (err, result) => {
          if (result) {
            const token = jwt.sign({userID:user[0]._id}, process.env.key);
            res.send({ msg: "Login Successful", token: token });
          } else {
            res.send("Wrong Credentials");
            console.log(err)
          }
        });
      } else {
          res.send("Wrong Credentials");
      }
    } catch (err) {
      res.send("Error in LoggingIn");
      console.log(err);
    }
  });

  userRouter.get("/", async(req, res) => {
    const all_users= await UserModel.find()
    res.send(all_users);
});
  
 

  module.exports={
    userRouter
  }