/*
  Account Controller
*/
const accountModel  = require("../models/account-model")
const Util = require("../utilities")
const utilities = require("../utilities")
const bcrypt = require("bcryptjs")
const accountCont = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()


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
    account_email: "",
    account_firstname: "",
    account_lastname: "",
    account_password: "",
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
    req.flash("error", 'Sorry, there was an error processing the registration.')
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
    req.flash("error", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      grid,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountCont.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("error", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      //Util.setAuthStatus(req,res)
      return res.redirect("/account/")
    }
    else {
      req.flash("error", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    res.locals.logedIn = false;
    res.locals.user = null;
    throw new Error('Access Forbidden')
  }
}

accountCont.accountManagementView = async function(req, res, next) {
  const nav = await utilities.getNav()
  const accountType = res.locals.user?.account_type?.trim()
  let user_name = ""
  let user_id
  let employee_manager = false
  let manager = false
  if (!accountType){
    //If we receive an invalid accountType, then we redirect to the home page.
    req.flash("notice", "Unauthorized access.")
    return res.redirect("/")
  }
  else {
    user_name = res.locals.user.account_firstname
    user_id = res.locals.user.account_id
    if (accountType.toLowerCase() !== "client") {
      employee_manager = true
      if (accountType.toLowerCase() === "admin"){
        manager = true
      }
    }
  } 
  // const classificationSelect = await utilities.buildClassificationList()
  res.status(201).render("account/account_management", {
      title: "Account Management",
      nav,
      user_name,
      user_id,
      employee_manager,
      manager,
      errors: null,
      // classificationSelect,
    })
  
}

accountCont.editAccountView = async function(req, res, next) {
  const nav = await utilities.getNav()
  const account_id = req.params.account_id;
  const accountData = await accountModel.getAccountById(account_id)
  const account_firstname = accountData.account_firstname
  const account_lastname = accountData.account_lastname
  const account_email = accountData.account_email
  if (!accountData) {
    req.flash("error", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
    return
  }
  else{
    res.status(201).render("account/update_account", {
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      errors: null,
      // classificationSelect,
    })
  }
}



accountCont.updateAccount = async function (req, res, next) {
  const nav = await utilities.getNav()
  let employee_manager = false
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const regResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )
  req.params.account_id = account_id
  res.locals.user.account_firstname = account_firstname
  res.locals.user.account_lastname = account_lastname

  if (regResult) {
    let user_name = account_firstname
    let user_id = account_id
    
    let data = await accountModel.getAccountById(user_id)
    if (data){
      req.flash(
      "notice",
      `Congratulations, you update your account.`
      )
      if (data.account_type.toLowerCase() !== "client")
      {
        employee_manager = true
      }
      
      res.render("account/account_management",
        {
          title: "Account Management",
          nav,
          user_name,
          user_id,
          employee_manager,
          errors: null,
        }
      )
    }
    else{
      req.flash(
      "error",
      `Error, The account update failed.`
      )
      accountCont.editAccountView(req, res, next)
    }
    
  } else {
    accountCont.editAccountView(req, res, next)
  }
}

accountCont.updateAccountPass = async function (req, res, next) {
  const nav = await utilities.getNav()
  const { account_id_pass, account_password } = req.body
  let employee_manager = false
  // Hash the password before storing
  let hashedPassword
  let data = await accountModel.getAccountById(account_id_pass)
  const {account_firstname, account_lastname,account_email, account_id, account_type} = data
  req.body = {
    account_email: account_email,
    account_firstname: account_firstname,
    account_lastname: account_lastname,
    account_id: account_id
  }
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
    const regResult = await accountModel.updatePass(
      account_id_pass,
      hashedPassword 
    )
    if (regResult) { 
        let user_name = account_firstname
        let user_id = account_id
        if (account_type.toLowerCase() !== "client")
        {
          employee_manager = true
        }
        req.flash(
          "notice",
          `Congratulations, you update your password.`
        )
        res.render("account/account_management",
          {
            title: "Account Management",
            nav,
            user_name,
            user_id,
            employee_manager,
            errors: null,
          }
        ) 
      }
      else{
        req.flash("error", "Sorry, the password update failed.")
        accountCont.editAccountView(req, res, next)
      }
  } catch (error) {
    req.flash("error", 'Sorry, there was an error processing the password update.')
    accountCont.editAccountView(req, res, next)
  }
}
accountCont.logout = async function (req, res, next) {
  res.clearCookie("jwt")
  res.redirect("/")
}

accountCont.editAccountRole = async function (req, res, next) {
  const nav = await utilities.getNav()
  let data = await accountModel.getFullAccountList()
  const firstAccount = data[0]
  const account_firstname = firstAccount.account_firstname
  const  account_lastname = firstAccount.account_lastname
  const account_id = firstAccount.account_id
  const account_email = firstAccount.account_email
  const current_account_type = firstAccount.account_type

  const account_type = await accountModel.getAccountTypes()

  res.render("account/account_role_management",
    {
      title: "Account Role Management",
      nav,
      data,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      account_type,
      current_account_type,
      errors: null,
    }
  )
}

accountCont.getuserData = async function (req, res, next) { 
 const result = await accountModel.getAccountById(req.params.userId)
 res.json(result)
}

module.exports = accountCont