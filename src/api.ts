import {
  ICurrentWeatherDataResponse,
  IWeeklyWeatherDataResponse,
} from "./types/apiTypes";
import {
  ICurrentWeatherData,
  ILocation,
  IWeeklyWeatherData,
} from "./types/weatherTypes";

const apiUrl = "https://api.open-meteo.com/v1/forecast";

export async function fetchCurrentWeather(
  latitude: number,
  longitude: number
): Promise<ICurrentWeatherData | null> {
  try {
    const response = await fetch(
      `${apiUrl}?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: ICurrentWeatherDataResponse = await response.json();
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
): Promise<IWeeklyWeatherData | null> {
  try {
    const response = await fetch(
      `${apiUrl}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: IWeeklyWeatherDataResponse = await response.json();
    return {
      time: data.daily.time,
      temperature_2m_max: data.daily.temperature_2m_max,
      temperature_2m_min: data.daily.temperature_2m_min,
      weathercode: data.daily.weathercode,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export function getPlaces(): ILocation[] {
  const placesJson = localStorage.getItem("places");
  return placesJson ? JSON.parse(placesJson) : [];
}

export function addToPlaces(place: ILocation) {
  const places = getPlaces();
  places.push(place);
  localStorage.setItem("places", JSON.stringify(places));
}

export function removePlace(placeName: string) {
  let places = getPlaces();
  places = places.filter(
    (place: ILocation) => place.locationName !== placeName
  );
  localStorage.setItem("places", JSON.stringify(places));
}
