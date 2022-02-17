const express = require("express");
const formidable = require("express-formidable");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

//Import Routes
const comicsRoutes = require("./routes/comics");
app.use(comicsRoutes);
const charactersRoutes = require("./routes/characters");
app.use(charactersRoutes);

//General Routes
app.get("/", (req, res) => {
  res.json({ message: "Marvel API reached" });
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

// app.listen(process.env.PORT || 3100, () => console.log("Server running"));
app.listen(4000, () => console.log("Server running"));
