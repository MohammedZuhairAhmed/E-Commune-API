const express = require("express");
const router = express.Router();
const busController = require("../controllers/busController");

router
  .route("/")
  .get(busController.gettAllBuses)
  .post(busController.createNewBus)
  .patch(busController.updateBus)
  .delete(busController.deleteBus);

module.exports = router;
