const Bus = require("../models/vehicle");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const gettAllBuses = asyncHandler(async (req, res) => {
  const Buses = await Bus.find().lean();

  if (!Buses?.length) {
    return res.status(400).json({ message: "no Buses found" });
  }
  res.json(Buses);
});

const createNewBus = asyncHandler(async (req, res) => {
  const { name, from, to } = req.body;

  // confirm data
  if (!name || !from || !to) {
    return res
      .status(400)
      .json({ message: "All mandatory fields are required" });
  }

  //check duplicate
  const duplicate = await Bus.findOne({ name }).lean().exec();

  if (duplicate) {
    return res.status(409).json({
      message: "Organization with same name already exists in the database",
    });
  }

  //Hash password
  const hashedPwd = await bcrypt.hash(password, 10);
  const organizationObject = {
    name,
    number,
    email,
    password: hashedPwd,
  };

  // create and store new user
  const organization = await Organization.create(organizationObject);

  if (organization) {
    //created
    res.status(201).json({
      message: `New organization with name ${name} and mail-id ${email} created`,
    });
  } else {
    res.status(400).json({ message: "Invalid data recieved!" });
  }
});

const updateOrganization = asyncHandler(async (req, res) => {
  const { id, name, number, email, password } = req.body;

  // confirm data
  if (!name || !number || !email || !id) {
    return res
      .status(400)
      .json({ message: "All mandatory fields are required" });
  }

  const organization = await Organization.findById(id).exec();

  if (!organization) {
    return res.status(400).json({ message: "Organization not found" });
  }

  //check for duplicate
  const duplicate = await Organization.findOne({ name }).lean().exec();

  //allow update to original commuter
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({
      message: "Organization with same name already exists in the database",
    });
  }

  organization.name = name;
  organization.email = email;
  organization.number = number;

  if (password) {
    //hasing password
    organization.password = await bcrypt.hash(password, 10);
  }

  const updatedOrganization = await organization.save();

  res.json({
    message: `Organization with name : ${updatedOrganization.name} updated`,
  });
});

const deleteOrganization = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Organization ID required" });
  }

  const organization = await Organization.findById(id).exec();

  if (!organization) {
    return res.status(400).json({ message: "Organization ID not found" });
  }

  const result = await organization.deleteOne();

  const reply = `name ${result.name} with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  gettAllOrganizations,
  createNewOrganization,
  updateOrganization,
  deleteOrganization,
};
