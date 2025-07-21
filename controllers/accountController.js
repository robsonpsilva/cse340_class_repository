/*
  Account Controller
*/

const utilities = require("../utilities")

const accountCont = {}

/* ***************************
 *  Build account view
 * ************************** */
accountCont.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav()
  let grid = await utilities.buildLoginScreen()
  res.render("account/login", {
    title: "Login",
    nav,
    grid,
  })
}
 

module.exports = accountCont