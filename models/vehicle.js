const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  fromLat: {
    type: Number,
    required: true,
  },
  fromLong: {
    type: Number,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  toLat: {
    type: Number,
    required: true,
  },
  toLong: {
    type: Number,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  departureTime: {
    type: Date,
    required: true,
  },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
