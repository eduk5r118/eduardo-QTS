const API = 'http://localhost:3000';

async function cadastro() {

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  const response = await fetch(`${API}/cadastro`, {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      email,
      senha
    })
  });

  const data = await response.json();

  if (data.success) {

    alert('Conta criada');

    window.location.href = 'login.html';

  } else {

    alert(data.error);
  }
}