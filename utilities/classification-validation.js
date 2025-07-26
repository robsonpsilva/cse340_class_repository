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
      .withMessage("A valid classification is required.")
      .custom(async (classification_name) => {
          const classExists = await classificationModel.checkExistingClass(classification_name);
          if (classExists) {
            throw new Error("The class exists. Use a different class name.");
          }
          return true; // ✔️ Validação passou!
      }),
  ];
}


validation.checkClassData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.render("inventory/add_classification", {
      errors: errors.array(), // importante usar array()
      title: "Add Classification",
      nav,
      classification_name: req.body.classification_name // mantém o valor digitado
    });
  }
  next(); // ✔️ Continua o fluxo!
};

module.exports = validation 