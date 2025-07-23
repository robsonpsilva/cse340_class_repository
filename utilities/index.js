const invModel = require("../models/inventory-model")
const Util = {}

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
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
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
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
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

/*
* Build Login Form
*/
Util.buildLoginScreen = async function() {
  let grid
  grid = 
  `   <div class = "external">
        <div class="form-container">
            <form class="login-form">
              <h2>Login</h2>

              <label for="email">Email:</label>
              <input type="email" id="email" placeholder="Enter your email" required>

              <label for="password">Password:</label>
              <input type="password" id="password" placeholder="Enter your password" required>

              <small class="password-instructions">
                Passwords must be a minimum of 12 characters and include 1 capital letter, 1 number, and 1 special character.
              </small>

              <button type="button" id="toggle-password">Show password</button>
              <button type="submit">Login</button>
            </form>

            <div class="signup-message">
              No Account? <a href="/account/register">Sign up</a>
            </div>
        </div>
      <div>
  `
  return grid
} 

/*
  Build Registration Form
*/

Util.buildRegisterScreen = async function() {
  let grid
  grid = 
  `   <div class = "external">
        <div class="form-container">
            <p> All fields are required"</p>
            <form id="registrationForm" action ="/account/register" method = "post" class="login-form">
              <label for="first_name">First Name:*</label>
              <input type="text" id="account_firstname" placeholder="Enter your First Name" required>

              <label for="last_name">Last Name:*</label>
              <input type="text" id="account_lastname" placeholder="Enter your Last Name" required>

              <label for="email">Email:*</label>
              <input type="email" id="account_email" placeholder="Enter your email" required>

              <label for="password">Password:*</label>
              <input type="password" id="account_password" placeholder="Enter your password" required>

              <small class="password-instructions">
                Passwords must be a minimum of 12 characters and include 1 capital letter, 1 number, and 1 special character.
              </small>

              <button type="button" id="toggle-password">Show password</button>
              <button type="submit">Register</button>
            </form>
        </div>
      <div>
  `
  return grid
  
}

/*
* Handle Errors Midlleware
*/

Util.handleErrors = async function (controller) {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      console.error("Erro capturado pelo middleware:", error);

      // Lógica de tratamento de erro...
      const statusCode = error.statusCode || 500;
      const errorMessage = process.env.NODE_ENV === 'production'
                           ? "Internal server error."
                           : error.message;

      res.status(statusCode).json({ message: errorMessage });
    }
  };
}

module.exports = Util



        