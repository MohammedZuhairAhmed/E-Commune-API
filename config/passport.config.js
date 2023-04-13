const Commuter = require("../models/commuter");
const bcrypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy(async (username, password, done) => {
      try {
        const user = await Commuter.findOne({ username: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password." });
        }
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    Commuter.findOne({ _id: id })
      .then((user) => {
        const userInformation = {
          username: user.username,
        };
        cb(null, userInformation);
      })
      .catch((err) => {
        cb(err);
      });
  });
};
