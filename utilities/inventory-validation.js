const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
//const invModel = require("../models/inv-model")


/* **********************************
*  Inventory Data Validation Rules
* ***********************************/
validate.addInventoryRules = () => {
  return [
    body("classification_id")
        .notEmpty()
        .withMessage("Classification is required.")
        .isInt()
        .withMessage("Classification must be a valid number."),
    body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("A valid make is required."),
    body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("A valid model is required.")
        .isLength({min:3})
        .withMessage("The model must have at least three characters."),
    body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("A description is required"),
    body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("A image is required"),
    body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("A thumbnail image is required"),
    body("inv_price")
        .trim()
        .notEmpty()
        .withMessage("Price is required.")
        .customSanitizer(value => {
            // Remove pontos usados como separadores de milhar, troca vírgula por ponto
            return value.replace(/\./g, "").replace(",", ".");
        })
        .matches(/^\d+(\.\d{2})?$/)
        .withMessage("Price must be in a valid format (e.g., 1234.56).")
        .isFloat({ min: 0.01, max: 5000000 })
        .withMessage("Price must be between $0.01 and $5,000,000.00."),
    body("inv_year")
        .trim()
        .notEmpty()
        .withMessage("Year is required.")
        .matches(/^\d{4}$/)
        .withMessage("Year must be a 4-digit number."),
    body("inv_miles")
        .trim()
        .notEmpty()
        .withMessage("Mileage is required.")
        .isInt({ min: 0 })
        .withMessage("Mileage must be a non-negative integer."),
    body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("A color is required"),
    
  ];
}

validate.checkInvData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const nav = await utilities.getNav();
        return res.render("inventory/add_inventory", {
          errors: errors.array(), // importante usar array()
          title: "Add Inventory",
          nav,
          classification_id: req.body.classification_id, // mantém o valor digitado
          inv_make: req.body.inv_make,
          inv_model: req.body.inv_model,
          inv_description: req.body.inv_description,
          inv_image: req.body.inv_image,
          inv_thumbnail: req.body.inv_thumbnail,
          inv_price: req.body.inv_price,
          inv_year: req.body.inv_year,
          inv_miles: req.body.inv_miles,
          inv_color: req.body.inv_color
        });
      }
      next();
}

module.exports = validate