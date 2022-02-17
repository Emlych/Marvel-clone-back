const express = require("express");
const axios = require("axios");
const router = express.Router();

const apiUrl = "https://lereacteur-marvel-api.herokuapp.com";

//Get characters list
router.get("/characters", async (req, res) => {
  console.log("route : /characters");
  try {
    const response = await axios.get(
      `${apiUrl}/characters?apiKey=${process.env.API_KEY}&limit=20`
    );
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ errorCharacters: error.message });
  }
});

//Get character's comics per id
router.get("/comics/:id", async (req, res) => {
  console.log("route : /characters/:id");
  try {
    const paramsId = req.params.id;
    const response = await axios.get(
      `${apiUrl}/comics/${paramsId}?apiKey=${process.env.API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ errorComicsPerCharacters: error.message });
  }
});

module.exports = router;
