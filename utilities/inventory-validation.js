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
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Classification must be a valid option."),
    body("inv_make")
        .trim()
        .escape()
        .isLength({min:3})
        .withMessage("Make must have at least three characters."),
    body("inv_model")
        .trim()
        .escape()
        .isLength({min:3})
        .withMessage("Model must have at least three characters."),
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
        .escape()
        .notEmpty()
        .withMessage("Price is required.")
        .customSanitizer(value => {
            if (typeof value === "string") {
                value = value.trim();

                // "1.234,5" ou "1.234,56"
                if (value.match(/^\d{1,3}(\.\d{3})*,\d{1,2}$/)) {
                return value.replace(/\./g, "").replace(",", ".");
                }

                // "1234,5" ou "1234,56"
                if (value.match(/^\d+,\d{1,2}$/)) {
                return value.replace(",", ".");
                }

                // "1234.5" ou "1234.56"
                if (value.match(/^\d+(\.\d{1,2})?$/)) {
                return value;
                }

                // Inteiros sem decimal
                if (value.match(/^\d+$/)) {
                return value;
                }
            }

            return value;
            })
        .withMessage("Price must be in a valid format (e.g., 1234.56).")
        .isFloat({ min: 0.01, max: 5000000 })
        .withMessage("Price must be between $0.01 and $5,000,000.00."),
    body("inv_year")
        .trim()
        .escape()
        .matches(/^\d{4}$/)
        .withMessage("Year must be a 4-digit number."),
    body("inv_miles")
        .trim()
        .escape()
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
        req.flash("error", "Sorry, the inserting failed. Err 400.")
        const formattedErrors = errors.array().map(err => err.msg);
        req.flash("error", formattedErrors);
        return res.status(400).render("inventory/add_inventory", {
          title: "Add Inventory",
          nav,
          list,
          inv_make: req.body.inv_make,
          inv_model: req.body.inv_model,
          inv_description: req.body.inv_description,
          inv_image: utilities.funEscapeHtml(req.body.inv_image),
          inv_thumbnail: utilities.funEscapeHtml(req.body.inv_thumbnail),
          inv_price: req.body.inv_price,
          inv_year: req.body.inv_year,
          inv_miles: req.body.inv_miles,
          inv_color: req.body.inv_color
        });
      }
      next();
}

module.exports = validate