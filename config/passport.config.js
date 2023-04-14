// const Commuter = require("../models/commuter");
// const bcrypt = require("bcrypt");
// const localStrategy = require("passport-local").Strategy;

// module.exports = function (passport) {
//   passport.use(
//     new localStrategy(async (username, password, done) => {
//       try {
//         const user = await Commuter.findOne({ username: username });
//         if (!user) {
//           return done(null, false, { message: "Incorrect username." });
//         }
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (isMatch) {
//           return done(null, user);
//         } else {
//           return done(null, false, { message: "Incorrect password." });
//         }
//       } catch (err) {
//         return done(err);
//       }
//     })
//   );

//   passport.serializeUser((user, cb) => {
//     cb(null, user.id);
//   });
//   passport.deserializeUser((id, cb) => {
//     Commuter.findOne({ _id: id })
//       .then((user) => {
//         const userInformation = {
//           username: user.username,
//         };
//         cb(null, userInformation);
//       })
//       .catch((err) => {
//         cb(err);
//       });
//   });
// };

const Commuter = require("../models/commuter");
const Organization = require("../models/organization");
const bcrypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport, model) {
  let usernameField;
  if (model === "commuter") {
    usernameField = "username";
  } else {
    usernameField = "email";
  }

  passport.use(
    new localStrategy(
      { usernameField },
      async (usernameOrEmail, password, done) => {
        try {
          const query = {};
          query[usernameField] = usernameOrEmail;
          console.log(query);
          const user = await (model === "commuter"
            ? Commuter
            : Organization
          ).findOne(query);
          if (!user) {
            return done(null, false, {
              message: `Incorrect ${usernameField}.`,
            });
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
      }
    )
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    (model === "commuter" ? Commuter : Organization)
      .findOne({ _id: id })
      .then((user) => {
        const userInformation = {
          username: user[usernameField],
        };
        cb(null, userInformation);
      })
      .catch((err) => {
        cb(err);
      });
  });
};
