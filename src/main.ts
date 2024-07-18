import {
  fetchCurrentWeather,
  fetchWeeklyWeather,
  cities,
  CurrentWeatherData,
  WeeklyWeatherData,
} from "./api";

function renderCityList() {
  const cityListElement = document.getElementById("cityList");
  if (!cityListElement) return;

  cities.forEach(async (city) => {
    const weatherData = await fetchCurrentWeather(
      city.latitude,
      city.longitude
    );
    if (weatherData) {
      const cityCard = document.createElement("div");
      cityCard.className =
        "city-card p-6 bg-blue-400 text-gray-800 rounded-lg cursor-pointer shadow-lg hover:bg-blue-300 transition";
      cityCard.innerHTML = `
        <div class="flex flex-col items-center">
          <h2 class="text-2xl font-bold mb-2">${city.name} </h2>
          <div class="text-6xl font-extrabold mb-2">${weatherData.temperature}°C</div>
          <p class="text-lg">Windspeed: ${weatherData.windspeed} m/s</p>
        </div>
      `;
      cityCard.addEventListener("click", () =>
        showWeeklyForecast(city.name, city.latitude, city.longitude)
      );
      cityListElement.appendChild(cityCard);
    }
  });
}

function showWeeklyForecast(
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

  fetchWeeklyWeather(latitude, longitude).then((data) => {
    if (data) {
      const forecastElement = document.getElementById("forecast");
      if (!forecastElement) return;

      let forecastHtml = `<h2 class="text-2xl font-bold mb-4 text-gray-900">Weekly Forecast for ${cityName}</h2>`;
      forecastHtml += '<ul class="space-y-2">';
      data.time.forEach((time, index) => {
        forecastHtml += `<li class="p-2 bg-blue-300 rounded-lg shadow-sm">
          <strong>Date:</strong> ${time} - 
          <strong>Max Temp:</strong> ${data.temperature_2m_max[index]} °C, 
          <strong>Min Temp:</strong> ${data.temperature_2m_min[index]} °C
        </li>`;
      });
      forecastHtml += "</ul>";

      forecastElement.innerHTML = forecastHtml;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCityList();
});
