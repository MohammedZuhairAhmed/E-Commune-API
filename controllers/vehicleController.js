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
    !orgId
  ) {
    return res
      .status(400)
      .json({ message: "All mandatory fields are required" });
  }

  //check duplicate
  const duplicate = await Vehicle.findOne({ number }).lean().exec();

  if (duplicate) {
    return res.status(409).json({
      message:
        "Vehicle with same vehicle number already exists in the database",
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
  };

  // create and store new vehicle
  const vehicle = await Vehicle.create(vehicleObject);

  if (vehicle) {
    // find organization by ID
    const organization = await Organization.findById(orgId);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // update selected_vehicle_ids array in the organization collection
    organization.selected_vehicle_ids.push(vehicle._id);
    await organization.save();

    //created
    res.status(201).json({
      message: `New vehicle with name ${name} and number ${number} created and organization updated`,
    });
  } else {
    res.status(400).json({ message: "Invalid data received!" });
  }
});

const updatevehicle = asyncHandler(async (req, res) => {
  // const { id, name, number, email, password } = req.body;
  // // confirm data
  // if (!name || !number || !email || !id) {
  //   return res
  //     .status(400)
  //     .json({ message: "All mandatory fields are required" });
  // }
  // const organization = await Organization.findById(id).exec();
  // if (!organization) {
  //   return res.status(400).json({ message: "Organization not found" });
  // }
  // //check for duplicate
  // const duplicate = await Organization.findOne({ name }).lean().exec();
  // //allow update to original commuter
  // if (duplicate && duplicate?._id.toString() !== id) {
  //   return res.status(409).json({
  //     message: "Organization with same name already exists in the database",
  //   });
  // }
  // organization.name = name;
  // organization.email = email;
  // organization.number = number;
  // if (password) {
  //   //hasing password
  //   organization.password = await bcrypt.hash(password, 10);
  // }
  // const updatedOrganization = await organization.save();
  // res.json({
  //   message: `Organization with name : ${updatedOrganization.name} updated`,
  // });
});

const deletevehicle = asyncHandler(async (req, res) => {
  // const { id } = req.body;
  // if (!id) {
  //   return res.status(400).json({ message: "Organization ID required" });
  // }
  // const organization = await Organization.findById(id).exec();
  // if (!organization) {
  //   return res.status(400).json({ message: "Organization ID not found" });
  // }
  // const result = await organization.deleteOne();
  // const reply = `name ${result.name} with ID ${result._id} deleted`;
  // res.json(reply);
});

module.exports = {
  getAllvehicles,
  createNewvehicle,
  updatevehicle,
  deletevehicle,
};
