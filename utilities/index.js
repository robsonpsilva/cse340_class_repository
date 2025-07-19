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
                <span>$${car.inv_price}</span>
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
                <span class="value">${car.inv_miles}</span>
            </div>
        </section>
      </div>`
  }
  else { 
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid
}

module.exports = Util



        