const express = require("express");
const axios = require("axios");
const router = express.Router();

//Get comics data
router.get("/comics", async (req, res) => {
  console.log("route: /comics");
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API_KEY}&limit=100`
    );
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
