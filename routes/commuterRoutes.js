const express = require("express");
const router = express.Router();
const commuterController = require("../controllers/commuterController");

router
  .route("/")
  .get(commuterController.gettAllCommuters)
  .post(commuterController.createNewCommuter)
  .patch(commuterController.updateCommuter)
  .delete(commuterController.deleteCommuter);

module.exports = router;
