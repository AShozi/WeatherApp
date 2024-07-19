export function getWeatherIcon(weatherCode: number): string {
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

export const weatherDescriptions: { [key: number]: string } = {
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
