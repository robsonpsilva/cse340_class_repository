/*
  Account Controller
*/
const accountModel  = require("../models/account-model")
const utilities = require("../utilities")

const accountCont = {}

/* ***************************
 *  Build account login view
 * ************************** */
accountCont.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav()
  let grid = await utilities.buildLoginScreen()
  res.render("account/login", {
    title: "Login",
    nav,
    grid,
    errors: null,
  })
}
 
/* ***************************
 *  Build account register view
 * ************************** */
accountCont.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav()
  let grid = await utilities.buildRegisterScreen()
  res.render("account/register", {
    title: "register",
    nav,
    grid,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountCont.registerAccount = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    grid = await utilities.buildSuccessRegister(account_firstname, account_lastname)
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      grid,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

module.exports = accountCont