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
  selected_bus_ids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Bus",
  },
});

const Commuter = mongoose.model("Commuter", commuterSchema);

module.exports = Commuter;
