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
            if (typeof value === "string") {
                if (value.includes(",") && value.includes(".")) {
                // Brazilian format with thousand separator and decimal
                return value.replace(/\./g, "").replace(",", ".");
                } else if (value.includes(",")) {
                // Brazilian format with decimal comma only
                return value.replace(",", ".");
                }
                // American format → leave unchanged
            }
            return value;
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
        let list = await utilities.buildClassificationList(req.body.classification_id)
        req.flash("notice", "Sorry, the inserting failed. Err 400.")
        const formattedErrors = errors.array().map(err => err.msg);
        req.flash("errors", formattedErrors);
        return res.status(400).render("inventory/add_inventory", {
          title: "Add Inventory",
          nav,
          list,
          inv_make: req.body.inv_make,
          inv_model: req.body.inv_model,
          inv_description: req.body.inv_description,
          inv_image: utilities.funescapeHtml(req.body.inv_image),
          inv_thumbnail: utilities.funescapeHtml(req.body.inv_thumbnail),
          inv_price: req.body.inv_price,
          inv_year: req.body.inv_year,
          inv_miles: req.body.inv_miles,
          inv_color: req.body.inv_color
        });
      }
      next();
}

module.exports = validate