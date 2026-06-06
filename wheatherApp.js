
// API Configuration
const API_KEY = '6d5f6205e43445c1a03141731261505';
const CURRENT_URL = 'https://api.weatherapi.com/v1/current.json';
const FORECAST_URL = 'https://api.weatherapi.com/v1/forecast.json';

// DOM Elements
const weatherInfo = document.getElementById('weatherInfo');
const weatherInfo2 = document.getElementById('weatherInfo2');
const forecastInfo = document.getElementById('forecast');

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loadingMsg = document.getElementById('loading');
const errorMsg = document.getElementById('error');

// Weather icon mapping
const weatherIcons = {          // Ovdje mapiramo vremenske uvjete na odgovarajuće ikone. Ako uvjet nije prepoznat, koristi se default ikona 🌍.
    'Sunny': '☀️',
    'Clear': '☀️',
    'Partly cloudy': '🌤',
    'Cloudy': '☁️',
    'Overcast': '☁️',
    'Light rain': '🌦',
    'Rain': '🌧',
    'Heavy rain': '🌧',
    'Thunderstorm': '⛈',
    'Snow': '❄️',
    'Mist': '🌫',
    'Fog': '🌫'
};

function displayWeather(data) {
    if(!weatherInfo){
        console.log("weatherInfo element not found");       // Provjeravamo postoji li element s id 'weatherInfo'. Ako ne postoji,  // ispisujemo poruku u konzolu i prekidamo funkciju.
        return;
    }
 
    const cityName = data.location.name; // here we get the city name from the API RESPONSE, adn we will use it do display a city name
    const countryName = data.location.country; // here we get the countryName frome the API response,  and we will use jt to display a country
    const tempC = data.current.temp_c; // here we get the current temperature in Celsius from the API response, and we will use it to display the current temperature in Celsius
    const tempF = data.current.temp_f; // - || - same but 4 F 

    const condition = data.current.condition.text;
    const icon = weatherIcons[condition] || '🌍';    //[condition] means a variable holding a script that was defined erlier in the: const condition = data.current.condition.text;

   document.getElementById('cityName').textContent =
        `${cityName}, ${countryName}`;          // we use `${}` to insert the cityName and countryName into the string that will be displayed in the element with id 'cityName'. This way we can show both the city and country in the same line.

    document.getElementById('currentDesc').textContent =
        condition.toUpperCase();

    document.getElementById('tempBig').innerHTML =
        `${tempC}°C / ${tempF}°F`;                  // same as cityname and country, but for Tempeture, and we use / to separate Celsius and Fahrenheit

    document.getElementById('weatherIcon').textContent =
        icon;                                      // we get the icon from the weatherIcons mapping based on the condition, and we display it in the element with id 'weatherIcon'
        loadingMsg.style.display = 'none';

    document.getElementById("feelsLike").textContent = 
        `${data.current.feelslike_c}°C`;

    document.getElementById("humidity").textContent=
        `${data.current.humidity}%`;

    document.getElementById('wind').textContent =
        `${data.current.wind_kph} km/h`;

    document.getElementById('pressure').textContent =
        `${data.current.pressure_mb} hPa`;

    const forecastDays = data.forecast.forecastday;
    forecastDays.forEach((day, index ) => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" } ).toUpperCase();

        

       const dayNum = document.getElementById(`ForecastDay${index + 1}`);

       if (dayNum){
        dayNum.textContent = dayName;
       }

        document.getElementById(`forecastIcon${index + 1}`).textContent = icon;
        document.getElementById(`forecastHigh${index + 1}`).textContent = `${day.day.maxtemp_c}°C`;
        document.getElementById(`forecastLow${index + 1}`).textContent = `${day.day.mintemp_c}°C`;
    });
        
}

// Fetch Weather Data
async function  fetchWeather(city) {
        showLoading();

        try{const response = await fetch(`${FORECAST_URL}?key=${API_KEY}&q=${city}&days=5`);
    
        if(!response.ok){
            throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();

        console.log(data);
        displayWeather(data);
    } catch (error) {
        console.error(error);
        showError();
    }                       // Rutturn data  = the Problem:

                                //return data; is outside the try block, but data is declared inside the try block. Once try/catch ends, data doesn't exist anymore.

}

function showLoading() {
    loadingMsg.style.display = 'block';
    errorMsg.style.display = 'none';
}

function showError() {
    loadingMsg.style.display = 'none';
    errorMsg.style.display = 'block';
}

function cityEnter(event) {
    if (event.key === "Enter") {
        searchBtn.click();
    }
}

// Event Listener
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if(city){
        fetchWeather(city);
    } else {
        alert('Please enter a city name.');
    }
});

cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});
