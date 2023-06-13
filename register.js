const registrationForm = document.getElementById('registrationForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const usernameInput = document.getElementById('username');
const errorMessage = document.getElementById('errorMessage');

registrationForm.addEventListener('submit', e => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;
  const username = usernameInput.value;
  const registerEndpoint = 'https://6BEC1.playfabapi.com/Client/RegisterPlayFabUser';

  const body = JSON.stringify({
    TitleId: '6BEC1',
    Username: username,
    Email: email,
    Password: password
  });

  fetch(registerEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  })
  .then(response => response.json())
  .then(data => {
    if (data.errorMessage) {
      errorMessage.textContent = data.errorMessage;
    } else {
      const successMessage = 'Registration successful! Please login with your credentials.';
      sessionStorage.setItem('registrationSuccessMessage', successMessage);
      window.location.href = 'index.html'; 
    }
  })
  .catch(error => {
    console.log('Error:', error);
  });
});
