const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validation = {}
const classificationModel = require("../models/classification-model")

/*  **********************************
*  Classification Data Validation Rules
* ********************************* */
validation.addClassRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("A valid classification is required.")
      .custom(async (classification_name) => {
        const classExists = await classificationModel.checkExistingClass(classification_name)
        if (classExists){
          throw new Error("The class exists. Use a different class name.")
        }
      }),
  ]
}

validation.checkClassData = async (req, res, next) => {
  const {classification_name} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add_classification", {
        errors,
        title:"Add Classification",
        nav,
      })
  }
}

module.exports = validation 