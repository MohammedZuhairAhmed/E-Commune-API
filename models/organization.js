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
  selected_vehicle_ids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Vehicle",
  },
  employee_ids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Commuter",
  },
  location: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
