require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConnection");
const { default: mongoose } = require("mongoose");
// const passport = require("passport");
// const passportLocal = require("passport-local").Strategy;
// const session = require("express-session");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
// app.use(
//   session({
//     secret: "secretcode",
//     resave: true,
//     saveUninitialized: true,
//   })
// );
// app.use(cookieParser("secretcode"));
// app.use(passport.initialize());
// app.use(passport.session());
// require("./config/passport.config")(passport);
app.use(logger);
app.use(cookieParser());
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root"));
app.use("/", require("./routes/authRoutes"));
app.use("/commuter", require("./routes/commuterRoutes"));
app.use("/organization", require("./routes/organizationRoutes"));
// app.use("/bus", require("./routes/busRoutes"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
