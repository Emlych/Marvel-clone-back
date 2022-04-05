const express = require("express");
const formidable = require("express-formidable");
require("dotenv").config();

const app = express();
app.use(formidable());

//cors
const cors = require("cors");
app.use(cors());

//Import et liaison bdd
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/marvel" || process.env.MONGODB_URI);

//Import Routes
const comicsRoutes = require("./routes/comics");
app.use(comicsRoutes);
const charactersRoutes = require("./routes/characters");
app.use(charactersRoutes);
const favoritesRoutes = require("./routes/favorites");
app.use(favoritesRoutes);
const userRoutes = require("./routes/user");
app.use(userRoutes);

//General Routes
app.get("/", (req, res) => {
  res.json({ message: "Marvel API reached" });
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

//app.listen(process.env.PORT || 4000, () => console.log("Server running"));
app.listen(4000, () => console.log("Server running"));
