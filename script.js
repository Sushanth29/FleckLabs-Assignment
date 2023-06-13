const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');
const welcomeMessage = document.getElementById('welcomeMessage');

const successMessage = sessionStorage.getItem('registrationSuccessMessage');

// Display the message in the welcomeMessageContainer
if (successMessage) {
  const welcomeMessage = document.createElement('p');
  welcomeMessage.textContent = successMessage;
  welcomeMessageContainer.appendChild(welcomeMessage);
  // Clear the stored success message from session storage
  sessionStorage.removeItem('registrationSuccessMessage');
}

loginForm.addEventListener('submit', e => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;
  const loginEndpoint = 'https://6BEC1.playfabapi.com/Client/LoginWithEmailAddress';

  // Call PlayFab login API here
  // Replace YOUR_LOGIN_API_ENDPOINT with the actual PlayFab login API endpoint
  // Replace YOUR_TITLE_ID with your PlayFab title ID
  fetch(loginEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      TitleId: '6BEC1',
      Email: email,
      Password: password
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.errorMessage) {
      errorMessage.textContent = data.errorMessage;
    } else {
      // Login successful, redirect to the home screen or perform further actions
      const sessionTicket = data.data.SessionTicket;
      const playFabId = data.data.PlayFabId;
      localStorage.setItem("sessionTicket", sessionTicket);
      localStorage.setItem("playfabId", playFabId);
      window.location.href = 'home.html';
    }
  })
  .catch(error => {
    console.log('Error:', error);
  });
});
