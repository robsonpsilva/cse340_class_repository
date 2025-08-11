const passwordInput = document.getElementById("account_password");
const account_firstname = document.getElementById("account_firstname")
const account_lastname = document.getElementById("account_lastname")
const account_email = document.getElementById("account_email")
const account_type = document.getElementById("account_type")
const account_id = document.getElementById("account_id")

async function loadNewData(userId) {
  try {
    const response = await fetch('/account/get-new-data/' + userId);
    const newData = await response.json();
    account_firstname.value = newData.account_firstname
    account_lastname.value = newData.account_lastname
    account_email.value = newData.account_email
    account_type.value = newData.account_type
    account_id.value = newData.account_id
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
}
