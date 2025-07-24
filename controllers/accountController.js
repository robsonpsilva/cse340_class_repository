/*
  Account Controller
*/
const accountModel  = require("../models/account-model")
const utilities = require("../utilities")
const bcrypt = require("bcryptjs")
const accountCont = {}



/* ***************************
 *  Build account login view
 * ************************** */
accountCont.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav()
  // let grid = await utilities.buildLoginScreen()
  res.render("account/login", {
    title: "Login",
    nav,
    // grid,
    errors: null,
  })
}
 
/* ***************************
 *  Build account register view
 * ************************** */
accountCont.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountCont.registerAccount = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
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
    grid = ''
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      grid,
      errors: null,
    })
  }
}

module.exports = accountCont