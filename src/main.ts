import {
  fetchCurrentWeather,
  fetchWeeklyWeather,
  getPlaces,
  addToPlaces,
  removePlace,
} from "./api";
import { ILocation } from "./types/weatherTypes";
import { cities } from "./utils/cityList";
import { getWeatherIcon, weatherDescriptions } from "./utils/weatherConstants";

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
  const loadingIndicator = document.getElementById("loadingIndicator");
  if (!cityListElement || !loadingIndicator) return;

  loadingIndicator.classList.remove("hidden");

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const cityDateElements = document.getElementsByClassName("current-date");
  const cityElements = document.getElementsByClassName("city-card");
  const weatherDataTempElements = document.getElementsByClassName("card-temp");
  const weatherWsElements = document.getElementsByClassName("card-wind ");
  const weatherDescElements = document.getElementsByClassName("card-desc ");
  const weatherIconElements = document.getElementsByClassName("card-icon");

  for (let i: number = 0; i < cities.length; i++) {
    const city = cities[i];
    const cityCard = cityElements[i];

    cityDateElements[i].innerHTML = `${currentDate}`;
    const weatherData = await fetchCurrentWeather(
      city.latitude,
      city.longitude
    );

    if (weatherData) {
      weatherDataTempElements[i].innerHTML = `${weatherData.temperature}°C`;
      weatherDataTempElements[
        i
      ].innerHTML = `Windspeed: ${weatherData.windspeed} m/s`;
      const weatherIcon = getWeatherIcon(weatherData.weathercode);
      weatherIconElements[i].setAttribute("src", `${weatherIcon} `);
      cityCard.addEventListener("click", () => {
        showWeeklyForecast(city.name, city.latitude, city.longitude);
      });
    }
  }

  document.querySelectorAll(".save-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const cityName = (event.target as HTMLButtonElement).dataset.cityName;
      if (cityName) {
        const city = cities.find((city) => city.name === cityName);
        if (!city) return;
        const cityData: ILocation = {
          latitude: city.latitude,
          locationName: city.name,
          longitude: city.longitude,
        };
        if (city) {
          addToPlaces(cityData);
          alert(`${cityName} has been saved!`);
        }
      }
    });
  });

  const places = getPlaces();
  for (const place of places) {
    const weatherData = await fetchCurrentWeather(
      place.latitude,
      place.longitude
    );

    if (weatherData) {
      const weatherIcon = getWeatherIcon(weatherData.weathercode);

      const cityCard = document.createElement("div");
      cityCard.className =
        "city-card p-6 bg-green-400 text-gray-800 rounded-lg cursor-pointer shadow-lg hover:bg-green-300 transition";
      cityCard.innerHTML = `
          <div class="flex items-center justify-between w-full">
            <div class="flex flex-col items-start">
              <h2 class="text-3xl font-extrabold mb-2">${
                place.locationName
              }</h2>
              <p class="text-lg text-white mb-2">${currentDate}</p>
              <div class="flex items-center mb-2">
                <div class="text-3xl font-extrabold mr-2">${
                  weatherData.temperature
                }°C</div>
              </div>
              <p class="text-lg mb-2">${
                weatherDescriptions[weatherData.weathercode]
              }</p>
              <p class="text-lg">Windspeed: ${weatherData.windspeed} m/s</p>
            </div>
            <img src="${weatherIcon}" alt="Weather icon" class="w-20 h-20" />
          </div>
        `;
      cityCard.addEventListener("click", () =>
        showWeeklyForecast(place.locationName, place.latitude, place.longitude)
      );
      const savedSection = document.getElementById("savedCitiesSection");
      if (!savedSection) return;
      savedSection.appendChild(cityCard);
    }
  }

  loadingIndicator.classList.add("hidden");
}

async function showWeeklyForecast(
  cityName: string,
  latitude: number,
  longitude: number
) {
  const cityListElement = document.getElementById("cityList");
  const weeklyForecastElement = document.getElementById("weeklyForecast");
  const loadingIndicator = document.getElementById("loadingIndicator");

  if (!cityListElement || !weeklyForecastElement || !loadingIndicator) return;

  cityListElement.classList.add("hidden");
  weeklyForecastElement.classList.remove("hidden");

  loadingIndicator.classList.remove("hidden");

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
      const weatherCode = data.weathercode[index];
      const weatherDescription =
        weatherDescriptions[weatherCode] || "Unknown weather";
      const weatherIcon = getWeatherIcon(weatherCode);

      const tempRange = 30;

      const tempDifference =
        data.temperature_2m_max[index] - data.temperature_2m_min[index];
      const progressBarWidth = (tempDifference / tempRange) * 100;

      forecastHtml += `
        <li class="p-4 bg-blue-300 rounded-lg shadow-sm flex items-start">
          <img src="${weatherIcon}" alt="Weather icon" class="w-16 h-16 mr-4" />
          <div class="flex flex-col flex-grow">
            <h3 class="text-xl font-semibold text-gray-800 mb-1">${dayFormatted}</h3>
            <p class="text-lg text-gray-700 mb-1">${weatherDescription}</p>
          </div>
          <div class="flex flex-col ml-4">
            <div class="flex items-center justify-between mb-2">
              <p class="text-lg text-gray-700"><strong></strong> ${data.temperature_2m_min[index]} °C</p>
              <p class="text-lg text-gray-700"><strong></strong> ${data.temperature_2m_max[index]} °C</p>
            </div>
            <!-- Progress Bar Container -->
            <div class="relative w-32 h-2 bg-gray-300 rounded-lg">
              <!-- Fill Element -->
              <div
                class="absolute h-full bg-blue-500 rounded-lg"
                style="width: ${progressBarWidth}%"
              ></div>
            </div>
          </div>
        </li>`;
    });
    forecastHtml += "</ul>";

    forecastElement.innerHTML = forecastHtml;
  }
  loadingIndicator.classList.add("hidden");
}

function navigateToMap() {
  window.location.href = "path/to/your/map.html";
}

document.getElementById("map")?.addEventListener("click", navigateToMap);

document.addEventListener("DOMContentLoaded", async () => {
  const loadingIndicator = document.getElementById("loadingIndicator");

  if (loadingIndicator) {
    loadingIndicator.classList.remove("hidden");
  }

  await renderCityList();

  if (loadingIndicator) {
    loadingIndicator.classList.add("hidden");
  }
});
