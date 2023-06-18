const Commuter = require("../models/commuter");
const Organization = require("../models/organization");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const gettAllCommuters = asyncHandler(async (req, res) => {
  const commuters = await Commuter.find().select("-password").lean();

  if (!commuters?.length) {
    return res.status(400).json({ message: "no commuters found" });
  }
  res.json(commuters);
});

const createNewCommuter = asyncHandler(async (req, res) => {
  const {
    fname,
    lname,
    username,
    number,
    email,
    password,
    lat,
    lng,
    orgID,
    opted_for_program,
  } = req.body;

  // Confirm data
  if (
    !fname ||
    !username ||
    !number ||
    !email ||
    !password ||
    !lat ||
    !lng ||
    !orgID ||
    opted_for_program === undefined ||
    opted_for_program === null
  ) {
    return res
      .status(400)
      .json({ message: "All mandatory fields are required" });
  }

  // Check for duplicate username
  const duplicate = await Commuter.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10);

  // Create commuter object
  const commuterObject = {
    fname,
    lname,
    username,
    number,
    email,
    orgID,
    opted_for_program,
    lat,
    lng,
    password: hashedPwd,
  };

  // Create and store new user
  const commuter = await Commuter.create(commuterObject);

  if (commuter) {
    // Find organization by ID
    const organization = await Organization.findById(orgID);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Update selected_vehicle_ids array in the organization collection
    organization.employee_ids.push(commuter._id);
    await organization.save();

    res.status(201).json({
      message: `New user with username ${username} and email ${email} created`,
    });
  } else {
    res.status(400).json({ message: "Invalid data received!" });
  }
});

const updateCommuter = asyncHandler(async (req, res) => {
  const {
    id,
    fname,
    lname,
    username,
    number,
    email,
    password,
    lat,
    lng,
    opted_for_program,
  } = req.body;

  // Confirm data
  if (!fname || !username || !number || !email || !id || !lat || !lng) {
    return res
      .status(400)
      .json({ message: "All mandatory fields are required" });
  }

  const commuter = await Commuter.findById(id).exec();

  if (!commuter) {
    return res.status(400).json({ message: "Commuter not found" });
  }

  // Check for duplicate username
  const duplicate = await Commuter.findOne({ username }).lean().exec();

  // Allow update to original commuter
  if (duplicate && duplicate._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  commuter.username = username;
  commuter.fname = fname;
  commuter.lname = lname;
  commuter.email = email;
  commuter.number = number;
  commuter.opted_for_program = opted_for_program;
  commuter.lat = lat;
  commuter.lng = lng;

  if (password) {
    // Hash password
    commuter.password = await bcrypt.hash(password, 10);
  }
  const updatedCommuter = await commuter.save();

  res.json({ message: `${updatedCommuter.username} updated` });
});

const deleteCommuter = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "commuter ID required" });
  }

  const commuter = await Commuter.findById(id).exec();

  if (!commuter) {
    return res.status(400).json({ message: "commuter ID not found" });
  }

  // Remove vehicle ID from the organization's selected_vehicle_ids array
  await Organization.updateMany(
    { employee_ids: { $in: [id] } },
    { $pull: { employee_ids: id } }
  );

  const result = await commuter.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  gettAllCommuters,
  createNewCommuter,
  updateCommuter,
  deleteCommuter,
};
