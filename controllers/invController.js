const invModel = require("../models/inventory-model")
const classModel = require("../models/classification-model")
const utilities = require("../utilities")



const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  try{
    const data = await invModel.getInventoryByClassificationId(classification_id)
    let nav = await utilities.getNav()
    const grid = await utilities.buildClassificationGrid(data)
    if (data.length > 0){
      const className = data[0].classification_name
      res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
      })
    } 
    else{
      res.render("./inventory/classification", {
        title: "Data Not Found",
        nav,
        grid,
      })
    }
  }
  catch(err){
    next(err)
  }
}

/* ***************************
 *  Build Detail Page view by inv_id (Car identifier)
 * ************************** */

invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getCarbyInvId(inv_id)
  const car = data[0]
  if (car){
    const grid = await utilities.buildCarDetailScreen(car)
    let nav = await utilities.getNav()

    res.render("./inventory/classification", {
      title: `${car.inv_year} ${car.inv_make} ${car.inv_model}`,
      nav,
      grid,
    })
  }
  else{
    const err = new Error('Data not found')
    err.status = 404
    return next(err)
  }

 }

/*
* Build Insert Page to Classification and Inventory tables
*/
invCont.management = async function (req, res, next) { 
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title:"Management",
    nav,
  }
  )
}

/*
* Add Classification Form
*/
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add_classification", {
    title:"Add New Classification",
    nav,
  }
  )
}

/*
* Add Inventory Form
*/
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let list = await utilities.buildClassificationList()
  res.render("./inventory/add_inventory", {
    title:"Add Inventory",
    nav,
    list,
  }
  )
}

/* *********************************************************************
* Insert process
* Adding aa new class in the classification table
* **********************************************************************/
invCont.registerClass = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const addResult = await classModel.registerClass(classification_name)
  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re added ${classification_name}.`
    )
    res.status(201).render("./inventory/add_classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  } else {
    req.flash("error", "Sorry, the inserting failed.")
    res.status(501).render("./inventory/add_classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

invCont.registerCar = async function (req, res, next) {
  let nav = await utilities.getNav()
  let list = await utilities.buildClassificationList()
  const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,inv_price, inv_miles, inv_color, classification_id} = req.body
  const addResult = await invModel.addCartoInventory(inv_make, inv_model, inv_year, inv_description, utilities.funEscapeHtml(inv_image), utilities.funEscapeHtml(inv_thumbnail),inv_price, inv_miles, inv_color, classification_id)
  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re added ${inv_model} a new model.`
    )
    res.status(201).render("./inventory/add_inventory", {
      title: "Add Inventory",
      nav,
      list,
      errors: null,
    })
  } else {
    req.flash("error", "Sorry, the inserting failed.")
    res.status(501).render("./inventory/add_inventory", {
      title: "Add Inventory",
      nav,
      list,
      errors: null,
    })
  }
}



/*******************
    Link test error
*******************/
 invCont.linkError = async (req, res, next) => {
    const errParam = req.params.errParam
    if( errParam == "0"){
      const err = new Error('Internal Server Error')
      
      return next(err)
    }
 }

module.exports = invCont