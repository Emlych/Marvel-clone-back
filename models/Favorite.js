const mongoose = require("mongoose");

const Favorite = mongoose.model("Favorite", {
  id: { type: String, required: true },
  title: { type: String, required: true },
  favType: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Favorite;
