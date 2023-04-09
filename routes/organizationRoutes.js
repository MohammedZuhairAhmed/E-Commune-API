const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organizationController");

router
  .route("/")
  .get(organizationController.gettAllOrganizations)
  .post(organizationController.createNewOrganization)
  .patch(organizationController.updateOrganization)
  .delete(organizationController.deleteOrganization);

module.exports = router;
