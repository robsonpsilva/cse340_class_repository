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
    let id = Number(classification_id)
    if (!Number.isNaN(id)){
      const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
      )
      return data.rows
    }
    else{
      throw new Error("Invalid Vehicle Category")
    }
    
  } catch (error) {
    return error
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

async function addCartoInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,inv_price, inv_miles, inv_color, classification_id) {
  try{
    const data = await pool.query(`INSERT INTO inventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,inv_price, inv_miles, inv_color, classification_id) 
      values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, 
      [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id] )
    return true
  }
  catch(error){
    console("Database insertion err in table inventory")
    return error
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getCarbyInvId, addCartoInventory, updateInventory}