const express = require("express");
const axios = require("axios");
const router = express.Router();

//Import Favorite model
const Favorite = require("../models/Favorite");
const User = require("../models/User");

//Authentication
const isAuthenticated = async (req, res, next) => {
  const tokenRegistered = req.headers.authorization;
  if (tokenRegistered) {
    const isTokenValid = await User.findOne({
      token: tokenRegistered.replace("Bearer ", ""),
    });
    if (isTokenValid) {
      console.log("Valid token, authorization given");
      next();
    } else {
      res.status(400).json("Unauthorized");
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

//Create new favorite comic
router.post("/favorites/add", isAuthenticated, async (req, res) => {
  console.log("route: /favorites/add");
  console.log(req.fields);
  const tokenUser = req.headers.authorization.replace("Bearer ", "");
  const targetUser = await User.findOne({ token: tokenUser });

  try {
    if (!(await Favorite.findOne({ id: req.fields.id }))) {
      const newFavorite = new Favorite({
        id: req.fields.id,
        title: req.fields.title,
        favType: req.fields.favType,
        owner: targetUser,
      });
      await newFavorite.save();
      res.json({ message: "favorite created", favorite: newFavorite });
    } else {
      res.status(400).json({ error: { message: "Item alread added" } });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Read favorite comics
router.get("/favorites/read", async (req, res) => {
  console.log("route: /favorites/read");
  try {
    const favorites = await Favorite.find();
    res.json({ favorites: favorites });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
