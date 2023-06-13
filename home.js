const getWeatherButton = document.getElementById('weatherButton');
const weatherHistoryContainer = document.getElementById('weatherContainer');

const temperatureHistoryButton = document.getElementById('temperatureHistoryButton');
const temperatureHistoryList = document.getElementById('temperatureHistoryList');

const developerButton = document.getElementById('developerButton');
const developerInfo = document.getElementById('developerInfo');

const logoutButton = document.getElementById('logoutButton');

let playfabSessionTicket = localStorage.getItem('sessionTicket');
let playfabId = localStorage.getItem('playfabId');
console.log(playfabId)
console.log(playfabSessionTicket)
let playfabSessionData = {}; 

getWeatherButton.addEventListener('click', () => {
    // Get the user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
  
        // Call the weather API to get the weather information based on the user's location
        // Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
        const apiKey = '921dda3f05e51bd2c741cd8e01cd7406';
        const weatherAPIEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  
        fetch(weatherAPIEndpoint)
          .then(response => response.json())
          .then(data => {
            // Extract the temperature value from the weather data
            const temperature = Math.round(data.main.temp);
            const weatherDescription = data.weather[0].description;
  
            const location = data.name;
            const humidity = data.main.humidity;
  
            const currentDate = new Date();
            const date = currentDate.toLocaleDateString();
            const time = currentDate.toLocaleTimeString();
  
            const weatherInfoElement = document.getElementById('weatherInfo');
            weatherInfoElement.innerHTML = `
              <p>Location: ${location}</p>
              <p>Date: ${date}</p>
              <p>Time: ${time}</p>
              <p>Temperature: ${temperature}&deg;C</p>
              <p>Weather: ${weatherDescription}</p>
              <p>Humidity: ${humidity}%</p>`;
  
            // Update the user's PlayFab session data with the weather history
            const updateUserDataEndpoint = `https://6BEC1.playfabapi.com/Client/UpdateUserData`;
  
            // Fetch the existing session data
            fetch('https://6BEC1.playfabapi.com/Client/GetUserData', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Authorization': playfabSessionTicket
              },
              body: JSON.stringify({
                PlayFabId: playfabId,
                Keys: ["SessionData"]
              })
            })
              .then(response => response.json())
              .then(data => {
                if (data.hasOwnProperty('data')) {
                  const userData = data.data.Data;
                  let sessionData = {};
  
                  if (userData.SessionData) {
                    sessionData = JSON.parse(userData.SessionData.Value);
                  }
  
                  const weatherHistory = sessionData.WeatherHistory || [];
  
                  // Construct the new weather history object to add to the session data
                  const newWeatherEntry = {
                    temperature: temperature,
                    timestamp: date + " " + time
                  };
  
                  // Add the new weather entry to the weather history
                  weatherHistory.push(newWeatherEntry);
  
                  // Update the session data with the new weather history
                  const newSessionData = {
                    ...sessionData,
                    WeatherHistory: weatherHistory
                  };
  
                  fetch(updateUserDataEndpoint, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'X-Authorization': playfabSessionTicket
                    },
                    body: JSON.stringify({
                      PlayFabId: playfabId,
                      Data: {
                        SessionData: JSON.stringify(newSessionData)
                      }
                    })
                  })
                    .then(response => response.json())
                    .catch(error => {
                      console.log('Error updating user data:', error);
                    });
                } else {
                  console.log('Error retrieving user data');
                }
              })
              .catch(error => {
                console.log('Error retrieving user data:', error);
              });
          });
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  });
  
  
  
  


// Button to fetch and show temperature history

temperatureHistoryButton.addEventListener('click', () => {
  // Code for fetching and displaying temperature history
    const playFabAPIEndpoint = 'https://6BEC1.playfabapi.com/Client/GetUserData';

    fetch(playFabAPIEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': playfabSessionTicket
    },
    body: JSON.stringify({
      PlayFabId: playfabId,
      Keys: ["SessionData"]
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.hasOwnProperty('data')) {
        const noWeatherHistoryMessage = document.getElementById('noWeatherHistoryMessage');
        noWeatherHistoryMessage.style.display = 'none';
        const userData = data.data.Data;
        if (userData.hasOwnProperty('SessionData')) {
          const sessionData = JSON.parse(userData.SessionData.Value);
          if (sessionData.hasOwnProperty('WeatherHistory')) {
            const noWeatherHistoryMessage = document.getElementById('noWeatherHistoryMessage');
            noWeatherHistoryMessage.style.display = 'none';
            const weatherHistory = sessionData.WeatherHistory;
            // Display the weather history
            const weatherHistoryElement = document.getElementById('weatherHistory');
            weatherHistoryElement.innerHTML = '';
            weatherHistory.forEach(entry => {
              const timestamp = new Date(entry.timestamp).toLocaleString();
              const temperature = entry.temperature;
              const listItem = document.createElement('li');
              listItem.textContent = `Timestamp: ${timestamp}, Temperature: ${temperature}\u00B0C`;
              weatherHistoryElement.appendChild(listItem);
            });
          } else {
            const noWeatherHistoryMessage = document.getElementById('noWeatherHistoryMessage');
            noWeatherHistoryMessage.style.display = 'block';
            console.log('WeatherHistory not found in session data');
          }
        } else {
            const noWeatherHistoryMessage = document.getElementById('noWeatherHistoryMessage');
            noWeatherHistoryMessage.style.display = 'block';
            console.log('SessionData not found in user data');
        }
      } else {
        console.log('Error retrieving user data');
      }
    })
    .catch(error => {
      console.log('Error retrieving user data:', error);
    });
});



// Button to show developer's name from PlayFab

developerButton.addEventListener('click', () => {
const secretKey = 'KN98KRI55HIGMTHUOKOW7NXR516RDFQRKD6GIAFT18GNUTHKJT';

fetch(`https://6BEC1.playfabapi.com/Admin/GetTitleInternalData`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-SecretKey': secretKey
  },
  body: JSON.stringify({})
})
  .then(response => response.json())
  .then(data => {
    if (data.hasOwnProperty('data')) {
      const titleData = data.data.Data;
      if (titleData.hasOwnProperty('AccountName')) {
        const username = titleData.AccountName;
        developerInfo.textContent = `Developed by: ${username}`;
      } else {
        console.log('Account name not found in title data');
      }
    } else {
      console.log('Error retrieving title data');
    }
  })
  .catch(error => {
    console.log('Error:', error);
  });
  });
  


// Button to logout
  
logoutButton.addEventListener('click', () => {
    const logoutEndpoint = 'https://6BEC1.playfabapi.com/Client/Logout';
  
    fetch(logoutEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': playfabSessionTicket
      }
    })
      .then(response => {
        // Clear user session data
        playfabSessionTicket = '';
        // Redirect to the login page
        window.location.href = 'index.html';
      })
      .catch(error => {
        console.log('Error:', error);
      });
  });
