const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

//Model
const Comic = mongoose.model("Comic", {
  title: { type: String },
  description: { type: String },
  thumbnail: { type: mongoose.Schema.Types.Mixed, default: {} },
});

//Routes
app.get(`/comics?${process.env.API_KEY}`, async (req, res) => {
  console.log("route: /comics");
  console.log("res ==>", res);

  try {
    const comics = await Comic.find();
    res.json({ message: "comics ok", comics: comics });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.listen(process.env.PORT || 3100, console.log("Server running"));

//https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=LmOAMRFehJ4C1aKU
