const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page" class= "menu">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles" class= "menu">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li class="invcard">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ***************************
 *  Build Car Detail Screen
 * ************************** */
Util.buildCarDetailScreen = async function(car) {
  let grid
  if (car){
    
    grid = `<div class="car-details-container">
              <section class="left-panel-image">
                <img src="${car.inv_image}" alt="${car.inv_make} ${car.inv_model}" class="car-image">
              </section> ` 
    grid += `<section class="right-panel-details">
            <h2 class="title">${car.inv_make} ${car.inv_model} Details</h2>
            
            <div class="detail-row price-row">
                <span class="label">Price:</span> 
                <span>$${Number(car.inv_price).toLocaleString()}</span>
            </div>
            
            <div class="detail-row description-row">
                <p class="description-text">
                    <span class="label">Description:</span> 
                    ${car.inv_description}
                </p>
            </div>
            
            <div class="detail-row color-row">
                <span class="label">Color:</span> 
                <span class="value">${car.inv_color}</span>
            </div>
            
            <div class="detail-row miles-row">
                <span class="label">Miles:</span> 
                <span class="value">${Number(car.inv_miles).toLocaleString()}</span>
            </div>
        </section>
      </div>`
  }
  else { 
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid
}

Util.buildSuccessRegister = async function (account_firstname, account_lastname) {
   grid = `
    <div class = "external-success-container">
      <div class="success-container">
          <div class="success-card">
              <svg class="success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <h1 class="success-title">Welcome, ${account_firstname} ${account_lastname}</h1>
              <p class="success-message">Your account has been successfully created.</p>
              <p class="success-message">You can now explore our platform.</p>
              <a href="/" class="success-button">Go to Homepage</a>
          </div>
      </div>
    </div>`
    return grid
}

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classification_id" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }

/*
* Handle Errors Midlleware
*/

Util.funEscapeHtml = function(safe) {
  return safe
    .replace(/&#x2F;/g, '/')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

Util.handleErrors = (controller) => {
  // Retorna a função de middleware real que o Express vai usar
  return async (req, res, next) => {
    try {
      // Tries to execute the controller function.
      // We pass the same arguments (req, res, next) that Express would provide.
      
      await controller(req, res, next);
    } catch (error) {
      // If an error is thrown within the controller, it will be caught here.
      console.error("Error caught by handleErrors middleware:", error);
      statusCode = 400

      // Determine the appropriate status code and error message.
      // Prioritize a 'statusCode' defined in the error itself (if you throw them with it).
      
      // In production, avoid exposing internal error details.
      const errorMessage = process.env.NODE_ENV === 'production' 
                           ? "An internal server error occurred." 
                           : error.message;

      // Sends a JSON error response to the client.
      res.status(statusCode).json({
        message: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  };
};

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /**
  * Test if user is Client because Client 
  * can't access the site management section
  */
 Util.checkPermissions = (req, res, next) => {
    const accountType = res.locals.user?.account_type?.trim()
    if (!accountType || accountType.toLowerCase() === "client"){
      if (!req.originalUrl.includes('/inv/type')){
        req.flash("notice", "Unauthorized access.")
      return res.redirect("/")
      }
      next()
      
    }
    else{
      next()
    }
 }


Util.setAuthStatus = (req, res, next) =>  {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      res.locals.logedIn = true;
      res.locals.user = user
    } catch (err) {
      res.locals.logedIn = false;
      res.locals.user = null;
    }
  } else {
    res.locals.logedIn = false;
    res.locals.user = null;
  }
}
module.exports = Util



        