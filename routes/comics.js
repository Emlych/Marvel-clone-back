const express = require("express");
const axios = require("axios");
const router = express.Router();

const apiUrl = "https://lereacteur-marvel-api.herokuapp.com";

//Get comics data
router.get("/comics", async (req, res) => {
  console.log("route: /comics");
  try {
    const limit = req.query.limit;
    const skip = req.query.skip;
    const title = req.query.title;
    const response = await axios.get(
      `${apiUrl}/comics?apiKey=${process.env.API_KEY}&limit=${limit}&skip=${skip}&title=${title}`
    );

    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
