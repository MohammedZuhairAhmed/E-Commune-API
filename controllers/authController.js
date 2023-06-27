const Commuter = require("../models/commuter");
const Organization = require("../models/organization");
const Vehicle = require("../models/vehicle");
const bcrypt = require("bcrypt");
const passport = require("passport");
// eslint-disable-next-line no-unused-vars
const passportLocal = require("passport-local").Strategy;

const asyncHandler = require("express-async-handler");

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

const createNewOrganization = asyncHandler(async (req, res) => {
  const { name, number, email, password, lat, lng } = req.body;

  // Confirm data
  if (!name || !number || !email || !password || !lat || !lng) {
    return res
      .status(400)
      .json({ message: "All mandatory fields are required" });
  }

  // Check duplicate
  const duplicate = await Organization.findOne({ name }).lean().exec();

  if (duplicate) {
    return res.status(409).json({
      message: "Organization with the same name already exists in the database",
    });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10);

  const organizationObject = {
    name,
    number,
    email,
    password: hashedPwd,
    lat,
    lng,
  };

  // Create and store new organization
  const organization = await Organization.create(organizationObject);

  if (organization) {
    // Created
    return res.status(201).json({
      message: `New organization with name ${name} and mail-id ${email} created`,
    });
  } else {
    return res.status(400).json({ message: "Invalid data received!" });
  }
});

const loginCommuter = (req, res, next) => {
  require("../config/passport.config")(passport, "commuter");
  // eslint-disable-next-line no-unused-vars
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send(req.user);
        console.log(req.user);
      });
    }
  })(req, res, next);
};

const loginOrganization = (req, res, next) => {
  const passportForOrganization = require("passport");
  require("../config/passport.config")(passportForOrganization, "organization");
  // eslint-disable-next-line no-unused-vars
  passportForOrganization.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send(req.user);
        console.log(req.user);
      });
    }
  })(req, res, next);
};

const loginCommuterID = asyncHandler(async (req, res, id) => {
  if (!id) {
    return res
      .status(400)
      .json({ message: "All mandatory fields are required" });
  }

  try {
    const data = await Commuter.findById(id)
      .select("-password")
      .populate("selected_vehicle_ids")
      .lean();

    if (data) {
      return res.status(200).json(data);
    } else {
      return res.status(400).json({ message: "Invalid ID" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Invalid ID" });
  }
});

const loginOrganizationID = asyncHandler(async (req, res, id) => {
  if (!id) {
    return res
      .status(400)
      .json({ message: "All mandatory fields are required" });
  }

  try {
    const data = await Organization.findById(id)
      .select("-password")
      .populate("employee_ids")
      .populate("selected_vehicle_ids")
      .lean();

    if (data) {
      return res.status(200).send(data);
    } else {
      return res.status(400).json({ message: "Invalid ID" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Invalid ID" });
  }
});

const selectVehicle = asyncHandler(async (req, res) => {
  try {
    const { cid, vid, seats } = req.body;
    let selected_seats = 0;

    seats.forEach((e) => {
      selected_seats += e;
    });
    const available_seats = Object.keys(seats).length - selected_seats;
    // Find the commuter by id
    const commuter = await Commuter.findById(cid);
    const vehicle = await Vehicle.findById(vid);

    if (!commuter) {
      return res.status(404).json({ error: "Commuter not found" });
    }

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Push vid to selected_vehicle_ids array
    commuter.selected_vehicle_ids.push(vid);
    vehicle.seats = seats;
    vehicle.available_seats = available_seats;
    // vehicle.no_of_seats = no_of_seats;

    // Save the updated commuter
    await commuter.save();
    await vehicle.save();

    return res.status(200).json({
      message:
        "Vehicle added to commuter successfully and also updated the seat matrix and seat count",
    });
  } catch (error) {
    console.error("Error adding vehicle to commuter:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  createNewCommuter,
  createNewOrganization,
  loginCommuter,
  loginOrganization,
  loginOrganizationID,
  loginCommuterID,
  selectVehicle,
};
