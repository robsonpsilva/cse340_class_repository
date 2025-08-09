const passwordInput = document.getElementById("account_password");

async function loadNewData(userId) {
  const selectElement = document.getElementById('account_user');
  selectElement.innerHTML = ''; // Limpa o menu antes da requisição, se preferir

  try {
    const response = await fetch('/account/get-new-data/' + userId);
    const newData = await response.json();

    // Preenche o menu suspenso com os novos dados.
    newData.forEach(item => {
      const option = document.createElement('option');
      option.value = item.value;
      option.textContent = item.text;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
}
