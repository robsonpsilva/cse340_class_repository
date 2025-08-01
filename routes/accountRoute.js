/*
* Account Router
*/
const regValidate = require('../utilities/account-validation')
const Util = require("../utilities")
// Needed Resources 
const express = require("express")
const router = new express.Router() 

const accountController = require("../controllers/accountController")


router.get("/",Util.checkLogin, Util.handleErrors(accountController.accountManagementView))

// Route to account login
router.get("/login", accountController.buildLogin)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  Util.handleErrors(accountController.accountLogin)
)

// Route to account registration
router.get("/register", Util.handleErrors(accountController.buildRegister))

router.post("/register", regValidate.registationRules(), regValidate.checkRegData, Util.handleErrors(accountController.registerAccount))

module.exports = router;