// Needed Resources 
const express = require("express")
const router = new express.Router() 
const Util = require("../utilities")

const invController = require("../controllers/invController")
// Route to build inventory by classification view
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId))

// Route to build car by id view
router.get("/detail/:invId", Util.handleErrors(invController.buildByInvId))

router.get("/error/:errParam", Util.handleErrors(invController.linkError))

module.exports = router;