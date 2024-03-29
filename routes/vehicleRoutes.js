const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");

router
  .route("/")
  .get(vehicleController.getAllvehicles)
  .post(vehicleController.createNewvehicle)
  .patch(vehicleController.updatevehicle)
  .delete(vehicleController.deletevehicle);

module.exports = router;
