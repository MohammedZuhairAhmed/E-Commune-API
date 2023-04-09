const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  name: {
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

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
