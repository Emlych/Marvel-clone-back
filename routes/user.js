const express = require("express");
const router = express.Router();
const User = require("../models/User");
const superheroes = require("superheroes");

//Password management
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

//Create a new User or log in
router.post("/user/signup", async (req, res) => {
  console.log("route: /user/signup");
  try {
    const password = req.fields.password;

    //check if user already registered
    const searchedUser = await User.findOne({ email: req.fields.email });
    console.log("searchedUser : ", searchedUser);
    //register new user
    if (searchedUser === null) {
      //create token, salt and hash for new user
      const newToken = uid2(16);
      const newSalt = uid2(16);
      const newHash = SHA256(password + newSalt).toString(encBase64);
      const newUser = new User({
        email: req.fields.email,
        username: req.fields.username,
        token: newToken,
        hash: newHash,
        salt: newSalt,
      });

      await newUser.save();

      res.json({
        _id: newUser._id,
        email: newUser.email,
        token: newUser.token,
        account: newUser.account,
      });
    }

    //user already exists, then return user token
    else {
      const newHash = SHA256(password + searchedUser.salt).toString(encBase64);
      if (newHash === searchedUser["hash"]) {
        res.json({ message: "Login authorized", token: searchedUser.token });
      } else {
        res.status(401).json({ message: "Unauthorized else", error: error });
      }
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//Generate a random superhero name
router.get("/user/signup/username", async (req, res) => {
  console.log("route : /user/signup/username");
  try {
    const randomUsername = superheroes.random();
    console.log("generate random name : ", randomUsername);
    res.json({ randomUsername: randomUsername });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
