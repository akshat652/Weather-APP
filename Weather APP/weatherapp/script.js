const apiKey = 'e4f3c4d0307f972294521bfff0233aea';

async function fetchWeatherData(city, stateCode, countryCode) {
    try {
        const geoResponse = await fetch(
            `http://api.openweathermap.org/geo/1.0/direct?q=${city},${stateCode},${countryCode}&limit=1&appid=${apiKey}`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to fetch geo data");
        }
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            throw new Error("No matching location found");
        }

        const { lat, lon } = geoData[0];

        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data");
        }
        const data = await weatherResponse.json();
        console.log(data);
        updateWeatherUI(data);
    } catch (error) {
        console.error(error);
        if (error.message === "No matching location found") {
            alert("This location is not in our database. Please try a different location.");
        }
    }
}

const cityElement = document.querySelector(".city");
const temperature = document.querySelector(".temp");
const windSpeed = document.querySelector(".wind-speed");
const humidity = document.querySelector(".humidity");
const visibility = document.querySelector(".visibility-distance");

const descriptionText = document.querySelector(".description-text");
const date = document.querySelector(".date");
const descriptionIcon = document.querySelector(".description i");

const formElement = document.querySelector(".search-form");
const inputElement = document.querySelector(".city-input");

formElement.addEventListener("submit", function (e) {
    e.preventDefault();

    const city = inputElement.value;
    const stateCode = ''; // Add the state code here
    const countryCode = ''; // Add the country code here

    if (city !== "") {
        fetchWeatherData(city, stateCode, countryCode);
        inputElement.value = "";
    }
});

function updateWeatherUI(data) {
    cityElement.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}`;
    windSpeed.textContent = `${data.wind.speed} km/h`;
    humidity.textContent = `${data.main.humidity}%`;
    visibility.textContent = `${data.visibility / 1000} km`;
    descriptionText.textContent = data.weather[0].description;

    const currentDate = new Date();
    date.textContent = currentDate.toDateString();
    const weatherIconName = getWeatherIconName(data.weather[0].main);
    descriptionIcon.innerHTML = `<i class="material-icons">${weatherIconName}</i>`;
}

function getWeatherIconName(weatherCondition) {
    const iconMap = {
        Clear: "wb_sunny",
        Clouds: "wb_cloudy",
        Rain: "umbrella",
        Thunderstorm: "flash_on",
        Drizzle: "grain",
        Snow: "ac_unit",
        Mist: "cloud",
        Smoke: "cloud",
        Haze: "cloud",
        Fog: "cloud",
    };

    return iconMap[weatherCondition] || "help";
}
