const API = 'http://localhost:3000';

async function login() {

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  const response = await fetch(`${API}/login`, {

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

    alert('Login realizado');

    window.location.href = 'index.html';

  } else {

    alert(data.error);
  }
}