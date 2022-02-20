const express = require("express");
const router = express.Router();

const User = require("../models/User");

//Password management
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

//Create a new User
router.post("/user/signup", async (req, res) => {
  console.log("route: /user/signup");
  try {
    const password = req.fields.password;
    const newSalt = uid2(16);
    const newHash = SHA256(password + newSalt).toString(encBase64);
    const newToken = uid2(16);

    //register new user
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
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
