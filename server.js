const express = require("express");
const formidable = require("express-formidable");
// const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(formidable());
app.use(cors());

// mongoose.connect(process.env.MONGODB_URI);

//Routes
app.get(`/comics`, async (req, res) => {
  console.log("route: /comics");
  console.log("res ==>", res);

  try {
    console.log(req.query);
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API_KEY}`
    );
    // const comics = await Comic.find();
    res.json({ message: "comics ok", response: response.data });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.listen(process.env.PORT || 3100, console.log("Server running"));

//https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=LmOAMRFehJ4C1aKU
