const pool = require("../database/")

/*
* Register new account
*/

async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try{
        const sql = `INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *`
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    }
    catch (error){
        return error.message
    }
    
}

/**
 * Update an existing account
 */

async function updateAccount(account_firstname, account_lastname, account_email, account_id) {
    try{
        const sql = `UPDATE account 
        SET  account_firstname =$1,
        account_lastname = $2,
        account_email = $3 
        WHERE account_id = $4 RETURNING *`
        
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
    }
    catch (error){
        return error.message
    }
    
}

async function updatePass(account_id, account_password) {
    try{
        const sql = `UPDATE account 
        SET  account_password =$1
        WHERE account_id = $2 RETURNING *`
        
        return await pool.query(sql, [account_password, account_id])
    }
    catch (error){
        return error.message
    }
    
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching client was found")
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getFullAccountList () {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account')
    return result.rows
  } catch (error) {
    return new Error("No matching user was found")
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getFullAccountList () {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account')
    return result.rows
  } catch (error) {
    return new Error("No matching user was found")
  }
}

async function getAccountTypes() {
  try {
    const sql = `
      SELECT enumlabel AS type_name
      FROM pg_enum
      JOIN pg_type ON pg_type.oid = pg_enum.enumtypid
      WHERE pg_type.typname = 'account_type'
      ORDER BY enumsortorder;
    `;
    const result = await pool.query(sql);
    
    // Mapeia o resultado para um array simples de strings (ex: ['Client', 'Employee'])
    const accountTypes = result.rows.map(row => row.type_name);
    
    return accountTypes;
  } catch (error) {
    console.error("getAccountTypes error: " + error);
    return []; // Retorna um array vazio em caso de erro
  }
}

async function checkExistingAccountType(accountType) {
  try {
    const sql = `
      SELECT EXISTS (
        SELECT 1
        FROM pg_enum
        JOIN pg_type ON pg_type.oid = pg_enum.enumtypid
        WHERE pg_type.typname = 'account_type' AND pg_enum.enumlabel = $1
      );
    `;
    const result = await pool.query(sql, [accountType]);
    
    // O resultado da consulta `EXISTS` é um booleano (true/false)
    return result.rows[0].exists;

  } catch (error) {
    console.error("checkExistingAccountType error: " + error);
    return false; // Retorna false em caso de erro para indicar que não existe
  }
}

/* *****************************
 * Function to update a user's account type
 * Parameters:
 * - account_type: the new account type to be set
 * - account_id: the ID of the user whose account type will be changed
 * Returns:
 * - A boolean indicating the success or failure of the operation
 * ***************************** */
async function updateAccountType(account_id, account_type) {
  try {
    const sql = "UPDATE account SET account_type = $1 WHERE account_id = $2 RETURNING *";
    const result = await pool.query(sql, [account_type, account_id]);
    
    // Returns true if the operation affected at least one row
    return result.rowCount > 0;
  } catch (error) {
    console.error("updateAccountType error: " + error);
    return false; // Returns false in case of an error
  }
}

module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, updatePass, getFullAccountList, getAccountTypes, checkExistingAccountType, updateAccountType}