import {
  fetchCurrentWeather,
  fetchWeeklyWeather,
  cities,
  CurrentWeatherData,
  WeeklyWeatherData,
} from "./api";

const weatherDescriptions: { [key: number]: string } = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Slight or moderate thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

function getWeatherIcon(weatherCode: number): string {
  switch (weatherCode) {
    case 0:
      return "./assets/sun.png";
    case 1:
    case 2:
    case 3:
      return "./assets/partly-cloudy.png";
    case 45:
    case 48:
      return "./assets/cloud.png";
    case 51:
    case 53:
    case 55:
      return "./assets/rain.png";
    case 56:
    case 57:
      return "./assets/rain.png";
    case 61:
    case 63:
    case 65:
      return "./assets/rainy-day.png";
    case 66:
    case 67:
      return "./assets/rain freeze.png";
    case 71:
    case 73:
    case 75:
      return "./assets/snowy.png";
    case 77:
      return "./assets/snowy grains.png";
    case 80:
    case 81:
    case 82:
      return "./assets/rainy shower.png";
    case 85:
    case 86:
      return "./assets/snow.png";
    case 95:
      return "./assets/storm.png";
    case 96:
    case 99:
      return "./assets/hail.png";
    default:
      return "./assets/sun.png";
  }
}

function formatDay(date: Date): string {
  const today = new Date();
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else {
    return dayOfWeek;
  }
}

async function renderCityList() {
  const cityListElement = document.getElementById("cityList");
  if (!cityListElement) return;

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  for (const city of cities) {
    const weatherData = await fetchCurrentWeather(
      city.latitude,
      city.longitude
    );

    if (weatherData) {
      const weatherIcon = getWeatherIcon(weatherData.weathercode);

      const cityCard = document.createElement("div");
      cityCard.className =
        "city-card p-6 bg-blue-400 text-gray-800 rounded-lg cursor-pointer shadow-lg hover:bg-blue-300 transition";
      cityCard.innerHTML = `
        <div class="flex flex-col items-center">
          <h2 class="text-3xl font-extrabold mb-2">${city.name}</h2>
           <p class="text-lg mb-2">${currentDate}</p>
          <img src="${weatherIcon}" alt="Weather icon" class="w-20 h-20 mb-2" />
          <div class="text-3xl font-bold mb-2">${
            weatherData.temperature
          }°C</div>
             <p class="text-lg"> ${
               weatherDescriptions[weatherData.weathercode]
             }</p>
          <p class="text-lg">Windspeed: ${weatherData.windspeed} m/s</p>
       
        </div>
      `;
      cityCard.addEventListener("click", () =>
        showWeeklyForecast(city.name, city.latitude, city.longitude)
      );
      cityListElement.appendChild(cityCard);
    }
  }
}

async function showWeeklyForecast(
  cityName: string,
  latitude: number,
  longitude: number
) {
  const cityListElement = document.getElementById("cityList");
  const weeklyForecastElement = document.getElementById("weeklyForecast");
  if (!cityListElement || !weeklyForecastElement) return;

  cityListElement.classList.add("hidden");
  weeklyForecastElement.classList.remove("hidden");

  const backButton = document.getElementById("backButton");
  if (backButton) {
    backButton.addEventListener("click", () => {
      cityListElement.classList.remove("hidden");
      weeklyForecastElement.classList.add("hidden");
    });
  }

  const data = await fetchWeeklyWeather(latitude, longitude);
  if (data) {
    const forecastElement = document.getElementById("forecast");
    if (!forecastElement) return;

    let forecastHtml = `<h2 class="text-2xl font-bold mb-4 text-gray-900">Weekly Forecast for ${cityName}</h2>`;
    forecastHtml += '<ul class="space-y-2">';
    data.time.forEach((time, index) => {
      const date = new Date(time);
      const dayFormatted = formatDay(date);
      const weatherCode = data.temperature_2m_max[index];
      const weatherDescription =
        weatherDescriptions[weatherCode] || "Unknown weather";
      const weatherIcon = getWeatherIcon(weatherCode);

      forecastHtml += `<li class="p-2 bg-blue-300 rounded-lg shadow-sm">
        <img src="${weatherIcon}" alt="Weather icon" class="w-10 h-10 inline-block mr-2" />
        <strong>${dayFormatted}:</strong> 
        <strong>Max Temp:</strong> ${data.temperature_2m_max[index]} °C, 
        <strong>Min Temp:</strong> ${data.temperature_2m_min[index]} °C, 
        <strong>Weather:</strong> ${weatherDescription}
      </li>`;
    });
    forecastHtml += "</ul>";

    forecastElement.innerHTML = forecastHtml;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCityList();
});
