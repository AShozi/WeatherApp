export interface CurrentWeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

export interface WeeklyWeatherData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

const apiUrl = "https://api.open-meteo.com/v1/forecast";

export async function fetchCurrentWeather(
  latitude: number,
  longitude: number
): Promise<CurrentWeatherData | null> {
  try {
    const response = await fetch(
      `${apiUrl}?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return {
      temperature: data.current_weather.temperature,
      windspeed: data.current_weather.windspeed,
      weathercode: data.current_weather.weathercode,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function fetchWeeklyWeather(
  latitude: number,
  longitude: number
): Promise<WeeklyWeatherData | null> {
  try {
    const response = await fetch(
      `${apiUrl}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return {
      time: data.daily.time,
      temperature_2m_max: data.daily.temperature_2m_max,
      temperature_2m_min: data.daily.temperature_2m_min,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// export const cities = [
//   { name: "Johannesburg", latitude: -26.2041, longitude: 28.0473 },
//   { name: "Pretoria", latitude: -25.7479, longitude: 28.2293 },
//   { name: "Rosebank", latitude: -26.1438, longitude: 28.0415 },
//   { name: "Durban", latitude: -29.8587, longitude: 31.0218 },
//   { name: "Cape Town", latitude: -33.9249, longitude: 18.4241 },
//   { name: "Pietermaritzburg", latitude: -29.6006, longitude: 30.3794 },
//   { name: "Port Elizabeth", latitude: -33.918, longitude: 25.5701 },
// ];
