import React, { useState, useEffect } from "react";
import {  TileLayer, Marker, Popup, MapContainer } from "react-leaflet";
import axios from "axios";

// API key for OpenWeatherMap API
const API_KEY = "8e1c82d91f9d5ec8342863b399f970e8";

// List of cities to fetch weather data for
const cities = ["Paris", "London", "New York", "Tokyo", "Berlin", "Rome", "Madrid", "Moscow",
"Beijing", "Dubai", "Istanbul", "Shanghai", "Mumbai", "São Paulo", "Jakarta", "Seoul", 
"Kuala Lumpur", "Mexico City", "Lima", "Bangkok", "Tehran", "Cairo", "Riyadh", "Hanoi", "Manila", 
"Ho Chi Minh City", "Baghdad", "Toronto", "Sydney", "Buenos Aires"];

// Main component
const App = () => {
  // State to store fetched weather data
  const [weatherData, setWeatherData] = useState([]);
  // State to store the selected city for displaying popup
  const [selectedCity, setSelectedCity] = useState(null);

  // Effect hook to fetch weather data for the cities
  useEffect(() => {
    // Async function to fetch data for each city using axios
    const fetchData = async () => {
      // Array of promises to fetch data for each city
      const promises = cities.map(city => axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`));
      // Wait for all promises to resolve
      const results = await Promise.all(promises);
      // Log results for debugging purposes
      console.log(results);
      // Set the weather data in the state
      setWeatherData(results.map(result => result.data));
    };

    // Fetch data initially
    fetchData();
    // Set an interval to refetch data every 10 seconds
    const intervalId = setInterval(fetchData, 10000);
    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
    
  }, []);
  
  // Render the component
  return (
    <div className="map-container">
      { 
      // MapContainer component from react-leaflet library
      <MapContainer center={[51.505, -0.09]} zoom={13} className="map">
   {/* TileLayer component from react-leaflet as base map */}
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  />
  {
    // Map over the fetched weather data to create markers for each city
    weatherData.map(city => (
    <Marker
      // Unique key for each marker
      // key={city.id}
      // console.log(key);
      // Latitude and longitude of the city
      position={[city.coord.lat, city.coord.lon]}
      onClick={() => setSelectedCity(city)}
      // className="style"
    ></Marker>
  ))}
  {selectedCity ? (
    // If selectedCity is true, show a Popup with city details
    <Popup
      position={[selectedCity.coord.lat, selectedCity.coord.lon]}
      onClose={() => setSelectedCity(null)}
    >
      <div>
        <h2>City Name: {selectedCity.name}</h2>
        <p>Temperature: {selectedCity.main.temp}°C</p>
        <p>Humidity: {selectedCity.main.humidity}%</p>
      </div>
    </Popup>
  ) : null}
  
</MapContainer>

        


 
  }</div>
  )
 
};

export default App;