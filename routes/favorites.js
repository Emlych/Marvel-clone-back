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

//Add or delete favorites
router.post("/favorites/handle", isAuthenticated, async (req, res) => {
  console.log("route: /favorites/handle");
  console.log("req fields : ", req.fields);

  //req.fields format : item and type keys
  const tokenUser = req.headers.authorization.replace("Bearer ", "");
  const targetUser = await User.findOne({ token: tokenUser });
  console.log("target User : ", targetUser);

  try {
    //item type = comic
    if (req.fields.type === "comic") {
      const targetUserFavComics = targetUser.favorites.favComics;
      console.log("comic id in item : ", req.fields.item._id);
      console.log("target user favorite comics : ", targetUserFavComics);

      //Case 1 : favorite doesn't exist
      // -> step 1.1 : push item's _id inside userFavComics array.
      // -> step 1.2 : create a new Favorite document for this comic
      if (!targetUserFavComics.includes(req.fields.item._id)) {
        console.log("Add this new favorite to comic list");

        //Step 1.1
        targetUserFavComics.push(req.fields.item._id);
        await targetUser.save();
        console.log(
          "target User registered ? ",
          targetUserFavComics.includes(req.fields.item._id)
        );

        //Step 1.2
        const newFavorite = new Favorite({
          comicId: req.fields.item._id,
          title: req.fields.item.title,
          description: req.fields.item.description,
          img_url:
            req.fields.item.thumbnail.path +
            "." +
            req.fields.item.thumbnail.extension,
          favType: "comic",
          userId: targetUser.id,
        });
        await newFavorite.save();

        //Send confirmation message : Favorite added.
        res.json({ message: "Favorite added." });
      }

      //Case 2 : favorite exists
      // -> step 2.1 : remove item's _id from inside userFavComics array.
      // -> step 2.2 : delete corresponding Favorite document for this comic
      else {
        console.log("Add this new favorite to comic list");

        //Step 2.1
        targetUserFavComics.splice(
          targetUserFavComics.indexOf(req.fields.item._id)
        );
        await targetUser.save();
        console.log(
          "Comic id removed from target favComics : ",
          targetUserFavComics.includes(req.fields.item._id)
        );

        //Step 2.2
        await Favorite.deleteOne({
          comicId: req.fields.item._id,
          userId: targetUser.id,
        });
        console.log("Favorite deleted, go check in Favorite Page.");

        //Send confirmation message : Favorite deleted.
        res.json({ message: "Favorite deleted." });
      }
    }

    //item type = character
    else if (req.fields.type === "character") {
      const targetUserFavCharacters = targetUser.favorites.favCharacters;
      console.log("character id in item : ", req.fields.item._id);
      console.log("target user favorite character : ", targetUserFavCharacters);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Read favorite comics
router.get("/favorites/read", async (req, res) => {
  console.log("route: /favorites/read");
  const tokenUser = req.headers.authorization.replace("Bearer ", "");
  try {
    const targetUser = await User.findOne({ token: tokenUser });
    // console.log("target user : ", targetUser);
    //valueOf(): returns value of id as a lowercase hexadecimal string
    const userId = targetUser._id.valueOf();
    const targetUserFavorites = await Favorite.find({
      favType: "comic",
      userId: userId,
    });
    // console.log("target user fav : ", targetUserFavorites);
    // const targetUserFavorites = targetUser.favorites;
    // console.log("target user favorites : ", targetUserFavorites);
    res.json({
      message: "favorites have been loaded",
      favComics: targetUserFavorites,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//Remove favorites from favorite page (client side)
router.post("/favorites/remove", isAuthenticated, async (req, res) => {
  console.log("route: /favorites/remove");
  const tokenUser = req.headers.authorization.replace("Bearer ", "");
  const targetUser = await User.findOne({ token: tokenUser });

  try {
    //Delete comic Id from target User
    targetUser.favorites.favComics.splice(
      targetUser.favorites.favComics.indexOf(req.fields.item.comicId)
    );
    await targetUser.save();

    //Delete favorite Document with corresponding userId and comicId
    const favTarget = await Favorite.findOne({
      comicId: req.fields.item.comicId,
    });

    if (favTarget)
      await Favorite.deleteOne({ comicId: req.fields.item.comicId });

    res.json({ message: "favorite removed" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
