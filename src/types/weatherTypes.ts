export interface ILocation {
  locationName: string;
  latitude: number;
  longitude: number;
}
export interface ICurrentWeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

export interface IWeeklyWeatherData {
  weathercode: number[];
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}
