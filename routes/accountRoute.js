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

//Route to manage an user account

router.get("/edit/:account_id", Util.handleErrors(accountController.editAccountView))

//Route to change personal user data
router.post("/edit", regValidate.editRules(), regValidate.checkEditData, Util.handleErrors(accountController.updateAccount))

//Route to change personal password
router.post("/pass", regValidate.passRules(), regValidate.checkEditPassData, Util.handleErrors(accountController.updateAccountPass))

//Logout Route
router.get("/logout", Util.handleErrors(accountController.logout))

router.get("/user_role/", Util.handleErrors(accountController.editAccountRole))

router.get("/get-new-data/:userId", Util.handleErrors(accountController.getuserData))


router.post("/admin", regValidate.roleRules(), regValidate.checkRole, Util.handleErrors(accountController.saveUserRole))

module.exports = router;