const express = require("express");
const router = express.Router();
const loginLimiter = require("../middleware/loginLimiter");
const authController = require("../controllers/authController");

router.route("/").post(loginLimiter);
router.post("/:model/auth/:method", (req, res) => {
  const model = req.params.model;
  const method = req.params.method;

  if (model === "commuter" && method === "register") {
    authController.createNewCommuter(req, res);
  } else if (model === "organization" && method === "register") {
    authController.createNewOrganization(req, res);
  } else if (model === "commuter" && method === "login") {
    authController.loginCommuter(req, res);
  } else if (model === "organization" && method === "login") {
    authController.loginOrganization(req, res);
  } else {
    // handle invalid model or method
    res.status(400).json({ error: "Invalid model or method" });
  }
});

module.exports = router;
