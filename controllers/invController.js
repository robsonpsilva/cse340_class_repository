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

 /* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
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

 /*
* Build management
*/
invCont.management = async function (req, res, next) { 
  let nav = await utilities.getNav()
  let classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title:"Management",
    nav,
    classificationSelect,
  }
  )
}

/*****************************
 * Build the edit cr view
 *****************************/

 invCont.buildEditInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const car = await invModel.getCarbyInvId(req.params.inv_id)
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = car[0]
  let list = await utilities.buildClassificationList(classification_id)
  const title = `Edit ${inv_make} ${inv_model}`
  res.render("./inventory/update_inventory", {
    title:title,
    nav,
    list,
    inv_id: inv_id,
    inv_make: inv_make,
    inv_model: inv_model,
    inv_description: inv_description,
    inv_image: utilities.funEscapeHtml(inv_image),
    inv_thumbnail: utilities.funEscapeHtml(inv_thumbnail),
    inv_price: inv_price,
    inv_year: inv_year,
    inv_miles: inv_miles,
    inv_color: inv_color,
    classification_id: classification_id
  }
  )
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/*****************************
 * Build the edit car view
 *****************************/

 invCont.buildDeleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const car = await invModel.getCarbyInvId(req.params.inv_id)
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    classification_id
  } = car[0]
  const title = `Delete ${inv_make} ${inv_model}`
  res.render("./inventory/delete_confirm", {
    title:title,
    nav,
    inv_id: inv_id,
    inv_make: inv_make,
    inv_model: inv_model,
    inv_price: inv_price,
    inv_year: inv_year,
    classification_id: classification_id
  }
  )
}


/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
  } = req.body
  const deleteResult = await invModel.deleteInventory(inv_id)
  if (deleteResult) {
    req.flash("notice", "The deletion was successful.")
    res.redirect("/inv/")
  } else {
    req,flash("error", "Sorry, the delete failed.")
    res.redirect(`/inv/delete/${inv_id}`)
  }
}

module.exports = invCont