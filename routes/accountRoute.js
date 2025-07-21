/*
* Account Router
*/
const utilities = require("../utilities")
// Needed Resources 
const express = require("express")
const router = new express.Router() 

const accountController = require("../controllers/accountController");

// Route to account
router.get("/login", accountController.buildLogin)



module.exports = router;