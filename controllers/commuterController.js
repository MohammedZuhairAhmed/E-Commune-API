const Commuter = require("../models/commuter");
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
  const { fname, lname, username, number, email, password } = req.body;

  // confirm data
  if (!fname || !username || !number || !email || !password) {
    return res
      .status(400)
      .json({ message: "All mandatory fields are required" });
  }

  //check duplicate
  const duplicate = await Commuter.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  //Hash password
  const hashedPwd = await bcrypt.hash(password, 10);
  const commuterObject = {
    fname,
    lname,
    username,
    number,
    email,
    password: hashedPwd,
  };

  // create and store new user
  const commuter = await Commuter.create(commuterObject);

  if (commuter) {
    //created
    res.status(201).json({
      message: `New user with username ${username} and mail-id ${email} created`,
    });
  } else {
    res.status(400).json({ message: "Invalid data recieved!" });
  }
});

const updateCommuter = asyncHandler(async (req, res) => {
  const { id, fname, lname, username, number, email, password } = req.body;

  // confirm data
  if (!fname || !username || !number || !email || !id) {
    return res
      .status(400)
      .json({ message: "All mandatory fields are required" });
  }

  const commuter = await Commuter.findById(id).exec();

  if (!commuter) {
    return res.status(400).json({ message: "Commuter not found" });
  }

  //check for duplicate
  const duplicate = await Commuter.findOne({ username }).lean().exec();

  //allow update to original commuter
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  commuter.username = username;
  commuter.fname = fname;
  commuter.lname = lname;
  commuter.email = email;
  commuter.number = number;

  if (password) {
    //hasing password
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
