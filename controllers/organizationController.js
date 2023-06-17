const Organization = require("../models/organization");
const Commuter = require("../models/commuter");
const Vehicle = require("../models/vehicle");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const gettAllOrganizations = asyncHandler(async (req, res) => {
  const organizations = await Organization.find().select("-password").lean();

  if (!organizations?.length) {
    return res.status(400).json({ message: "no organizations found" });
  }
  res.json(organizations);
});

const createNewOrganization = asyncHandler(async (req, res) => {
  // const { name, number, email, password, from, to } = req.body;
  // return res.json({message : `hello ${name} ${from} ${to} `});
  // Confirm data
  // if (!name || !number || !email || !password || !from || !to) {
  //   return res.status(400).json({ message: "All mandatory fields are required" });
  // }

  // // Check duplicate
  // const duplicate = await Organization.findOne({ name }).lean().exec();

  // if (duplicate) {
  //   return res.status(409).json({
  //     message: "Organization with the same name already exists in the database",
  //   });
  // }

  // // Hash password
  // const hashedPwd = await bcrypt.hash(password, 10);
  // const newOrg = new Organization({
  //   name,
  //   number,
  //   email,
  //   password: hashedPwd,
  //   from,
  //   to,
  // })

  // // Create and store new organization
  // const organization = await Organization.create(newOrg);

  // if (organization) {
  //   // Created
  //   res.status(201).json({
  //     message: `New organization with name ${name} and mail-id ${email} created`,
  //   });
  // } else {
  //   res.status(400).json({ message: "Invalid data received!" });
  // }
});

const updateOrganization = asyncHandler(async (req, res) => {
  const { id, name, number, email, password, location } = req.body;

  // Confirm data
  if (!name || !number || !email || !id) {
    return res
      .status(400)
      .json({ message: "All mandatory fields are required" });
  }

  const organization = await Organization.findById(id).exec();

  if (!organization) {
    return res.status(400).json({ message: "Organization not found" });
  }

  // Check for duplicate
  const duplicate = await Organization.findOne({ name }).lean().exec();

  // Allow update to original organization
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({
      message: "Organization with the same name already exists in the database",
    });
  }

  organization.name = name;
  organization.email = email;
  organization.number = number;
  organization.location = location; // Assign the location object to the organization

  if (password) {
    // Hashing password
    organization.password = await bcrypt.hash(password, 10);
  }

  const updatedOrganization = await organization.save();

  res.json({
    message: `Organization with name: ${updatedOrganization.name} updated`,
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

  // Delete associated vehicles
  await Vehicle.deleteMany({ _id: { $in: organization.selected_vehicle_ids } });

  // Delete associated employees
  await Commuter.deleteMany({ _id: { $in: organization.employee_ids } });

  // Delete the organization
  const result = await organization.deleteOne();

  const reply = `Organization with name ${result.name} and ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  gettAllOrganizations,
  createNewOrganization,
  updateOrganization,
  deleteOrganization,
};
