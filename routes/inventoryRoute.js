// Needed Resources 
const express = require("express")
const router = new express.Router() 

const invController = require("../controllers/invController")
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to build car by id view
router.get("/detail/:invId", invController.buildByInvId)

router.get("/error/:errParam", invController.linkError)

module.exports = router;