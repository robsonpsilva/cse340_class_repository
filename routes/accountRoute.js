/*
* Account Router
*/
const Util = require("../utilities")
// Needed Resources 
const express = require("express")
const router = new express.Router() 

const accountController = require("../controllers/accountController");

// Route to account login
router.get("/login", accountController.buildLogin)

// Route to account registration
router.get("/register", accountController.buildRegister)

router.post("/register", Util.handleErrors(accountController.buildRegister))

module.exports = router;