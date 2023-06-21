const express = require("express");
const router = express.Router();
const loginLimiter = require("../middleware/loginLimiter");
const authController = require("../controllers/authController");

router.route("/").post(loginLimiter);
router.get("/:model/auth/:method/:id", (req, res) => {
  const model = req.params.model;
  const method = req.params.method;
  const id = req.params.id;

  if (model === "organization" && method === "id") {
    authController.loginOrganizationID(req, res, id);
  } else if (model === "commuter" && method === "id") {
    authController.loginCommuterID(req, res, id);
  } else {
    res.status(400).json({ error: "Invalid model or method" });
  }
});
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

router.route("/vehicle/auth/select").patch(authController.selectVehicle);

module.exports = router;
