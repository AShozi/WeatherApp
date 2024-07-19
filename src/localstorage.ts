const initialCities = [
  { name: "Johannesburg", latitude: -26.2041, longitude: 28.0473 },
  { name: "Pretoria", latitude: -25.7479, longitude: 28.2293 },
  { name: "Rosebank", latitude: -26.1438, longitude: 28.0415 },
  { name: "Durban", latitude: -29.8587, longitude: 31.0218 },
  { name: "Cape Town", latitude: -33.9249, longitude: 18.4241 },
  { name: "Pietermaritzburg", latitude: -29.6006, longitude: 30.3794 },
  { name: "Port Elizabeth", latitude: -33.918, longitude: 25.5701 },
];

if (!localStorage.getItem("cities")) {
  localStorage.setItem("cities", JSON.stringify(initialCities));
}
