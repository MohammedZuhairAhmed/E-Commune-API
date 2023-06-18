const mongoose = require("mongoose");

const commuterSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  selected_vehicle_ids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Vehicle",
  },
  orgID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
  opted_for_program: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const Commuter = mongoose.model("Commuter", commuterSchema);

module.exports = Commuter;
