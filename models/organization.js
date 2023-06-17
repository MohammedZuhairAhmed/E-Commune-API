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
  from: {
    type: Number,
    required: true,
  },
  to: {
    type: Number,
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
});


const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
