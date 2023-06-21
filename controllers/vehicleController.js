const Vehicle = require("../models/vehicle");
const Organization = require("../models/organization");
const asyncHandler = require("express-async-handler");

const getAllvehicles = asyncHandler(async (req, res) => {
  const Vehicles = await Vehicle.find().lean();

  if (!Vehicles?.length) {
    return res.status(400).json({ message: "no Vehicles found" });
  }
  res.json(Vehicles);
});

const createNewvehicle = asyncHandler(async (req, res) => {
  const {
    name,
    type,
    from,
    to,
    fromLat,
    fromLong,
    toLat,
    toLong,
    number,
    orgId,
    arrivalTime,
    departureTime,
    seats,
    no_of_seats,
    pickupPoints,
  } = req.body;

  if (
    !name ||
    !type ||
    !from ||
    !to ||
    !fromLat ||
    !fromLong ||
    !toLat ||
    !toLong ||
    !number ||
    !orgId ||
    !arrivalTime ||
    !departureTime ||
    !seats ||
    !no_of_seats ||
    !pickupPoints
  ) {
    return res
      .status(400)
      .json({ message: "All mandatory fields are required" });
  }

  // Check duplicate vehicle number
  const duplicate = await Vehicle.findOne({ number }).lean().exec();

  if (duplicate) {
    return res.status(409).json({
      message:
        "Vehicle with the same vehicle number already exists in the database",
    });
  }

  const vehicleObject = {
    name,
    type,
    from,
    to,
    fromLat,
    fromLong,
    toLat,
    toLong,
    number,
    arrivalTime,
    departureTime,
    seats,
    pickupPoints,
    no_of_seats,
  };

  // Create and store a new vehicle
  const vehicle = await Vehicle.create(vehicleObject);

  if (vehicle) {
    // Find organization by ID
    const organization = await Organization.findById(orgId);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Update selected_vehicle_ids array in the organization collection
    organization.selected_vehicle_ids.push(vehicle._id);
    await organization.save();

    // Created
    res.status(201).json({
      message: `New vehicle with name ${name} and number ${number} created and organization updated`,
    });
  } else {
    res.status(400).json({ message: "Invalid data received!" });
  }
});

const updatevehicle = asyncHandler(async (req, res) => {
  const {
    id,
    name,
    type,
    from,
    to,
    fromLat,
    fromLong,
    toLat,
    toLong,
    number,
    arrivalTime,
    departureTime,
    seats,
    pickupPoints,
    no_of_seats,
  } = req.body;

  if (
    !id ||
    !name ||
    !type ||
    !from ||
    !to ||
    !fromLat ||
    !fromLong ||
    !toLat ||
    !toLong ||
    !number ||
    !arrivalTime ||
    !departureTime ||
    !seats ||
    !pickupPoints ||
    !no_of_seats
  ) {
    return res
      .status(400)
      .json({ message: "All mandatory fields are required" });
  }

  const vehicle = await Vehicle.findById(id).exec();
  if (!vehicle) {
    return res.status(400).json({ message: "Vehicle not found" });
  }

  // Check for duplicate vehicle number
  const duplicate = await Vehicle.findOne({ number }).lean().exec();
  // Allow update to the original vehicle
  if (duplicate && duplicate._id.toString() !== id) {
    return res.status(409).json({
      message:
        "Vehicle with the same vehicle number already exists in the database",
    });
  }

  vehicle.name = name;
  vehicle.type = type;
  vehicle.from = from;
  vehicle.to = to;
  vehicle.fromLat = fromLat;
  vehicle.fromLong = fromLong;
  vehicle.toLat = toLat;
  vehicle.toLong = toLong;
  vehicle.number = number;
  vehicle.arrivalTime = arrivalTime;
  vehicle.departureTime = departureTime;
  vehicle.seats = seats;
  vehicle.pickupPoints = pickupPoints;
  vehicle.no_of_seats - no_of_seats;

  const updatedVehicle = await vehicle.save();
  res.json({
    message: `Vehicle with number: ${updatedVehicle.number} updated`,
  });
});

const deletevehicle = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Vehicle ID required" });
  }
  const vehicle = await Vehicle.findById(id).exec();
  if (!vehicle) {
    return res.status(400).json({ message: "vehicle ID not found" });
  }

  // Remove vehicle ID from the organization's selected_vehicle_ids array
  await Organization.updateMany(
    { selected_vehicle_ids: { $in: [id] } },
    { $pull: { selected_vehicle_ids: id } }
  );

  const result = await vehicle.deleteOne();
  const reply = `vehicle with number ${result.number} with ID ${result._id} deleted`;
  res.json(reply);
});

module.exports = {
  getAllvehicles,
  createNewvehicle,
  updatevehicle,
  deletevehicle,
};
