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
  seats: {
    type: [Number],
    required: true,
  },
  no_of_seats: {
    type: Number,
    required: true,
  },
  available_seats: {
    type: Number,
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
  pickupPoints: {
    type: [
      {
        location: {
          lat: { type: Number, required: true },
          lng: { type: Number, required: true },
        },
        stopover: { type: Boolean, required: true },
      },
    ],
    required: true,
  },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
