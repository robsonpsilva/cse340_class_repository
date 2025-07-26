const pool = require("../database")

/* **********************
 *   Check for existing class
 * ********************* */
async function checkExistingClass(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount > 0
  } catch (error) {
    return error.message
  }
}

/* **********************
 * Insert new class
 * ********************* */
async function registerClass(classification_name) {
  try {
    const sql = "INSERT INTO classification(classification_name) VALUES($1) RETURNING *";
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0]; // retorna o objeto completo inserido
  } catch (error) {
    return error.message;
  }
}

module.exports = {checkExistingClass, registerClass}