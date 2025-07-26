// Needed Resources 

const classValidate = require("../utilities/classification-validation")
const invValidate = require("../utilities/inventory-validation")
const express = require("express")
const router = new express.Router() 
const Util = require("../utilities")


const invController = require("../controllers/invController")

//Route to the Management Page
router.get("/", Util.handleErrors(invController.management));

//Route to the Add New Classification Form
router.get("/add_classification", Util.handleErrors(invController.buildAddClassification))

//Process the Add Classification attempt
router.post("/add_classification", classValidate.addClassRules(), classValidate.checkClassData, Util.handleErrors(invController.registerClass))

//Route to the Add New Vehicle Form
router.get("/add_inventory", Util.handleErrors(invController.buildAddInventory)) 

//Process the Add new car attempt

route.post("/add_inventory", invValidate.add )

// Route to build inventory by classification view
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId))

// Route to build car by id view
router.get("/detail/:invId", Util.handleErrors(invController.buildByInvId))

router.get("/error/:errParam", Util.handleErrors(invController.linkError))

module.exports = router;