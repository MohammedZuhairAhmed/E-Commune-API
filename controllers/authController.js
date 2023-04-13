const Commuter = require("../models/commuter");
const Organization = require("../models/organization");
const bcrypt = require("bcrypt");
const passport = require("passport");
// eslint-disable-next-line no-unused-vars
const passportLocal = require("passport-local").Strategy;
require("../config/passport.config")(passport);

const asyncHandler = require("express-async-handler");

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

const loginCommuter = (req, res, next) => {
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

const loginOrganization = (req, res) => {};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  createNewCommuter,
  createNewOrganization,
  loginCommuter,
  loginOrganization,
  logout,
};
