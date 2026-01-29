const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  totalSlots: Number,
  availableSlots: Number,
  mapLink: String,

  // NEW: multiple images
  images: [String]
});

module.exports = mongoose.model("Parking", parkingSchema);
