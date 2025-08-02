const passwordInput = document.getElementById("account_password");
const toggleBtn = document.getElementById("toggle-password");

let visible = false;

toggleBtn.addEventListener("click", () => {
  visible = !visible;
  passwordInput.type = visible ? "text" : "password";
  toggleBtn.textContent = visible ? "Hide password" : "Show password";
});



