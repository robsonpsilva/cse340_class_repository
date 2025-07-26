const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    
    console.error("getclassificationsbyid error " + error)
  }
}

/****************************** 
 * Get a specific inventory item
*******************************/
async function getCarbyInvId(inv_id) {
  try{
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      WHERE i.inv_id = $1`, [inv_id]
    )
    return data.rows
  }
  catch (error){
    console.error("getCarbyInvId error" + error)
  }
}

async function addCartoInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,inv_price, inv_miles, inv_color) {
  try{
    const data = await pool.query(`INSERT INTO inventory values($1, $2, $3, $4, $5, $6, $7, $8, $9)`, 
      [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,inv_price, inv_miles, inv_color] )
    return true
  }
  catch(error){
    console("Database insertion err in table inventory")
    return error
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getCarbyInvId, addCartoInventory}