const Organization = require("../models/organization");
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
  const { name, number, email, password } = req.body;

  // confirm data
  if (!name || !number || !email || !password) {
    return res
      .status(400)
      .json({ message: "All mandatory fields are required" });
  }

  //check duplicate
  const duplicate = await Organization.findOne({ name }).lean().exec();

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
