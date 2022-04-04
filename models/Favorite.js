const mongoose = require("mongoose");

const Favorite = mongoose.model("Favorite", {
  comicId: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  img_url: String,
  favType: { type: String, required: true },
  userId: { required: true, type: String },
});

module.exports = Favorite;
