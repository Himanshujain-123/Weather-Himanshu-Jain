const express = require("express");
const axios = require("axios");

const app = express();
const port = 5000;

// Use an in-memory cache to store the weather data for 10 minutes
const cache = {};
const cacheExpiry = 10 * 60 * 1000; // 10 minutes
const API_KEY = "8e1c82d91f9d5ec8342863b399f970e8";
app.get("/weather/:page", async (req, res) => {
  try {
    const page = req.params.page || 1;
    let weatherData = cache.weatherData;
  console.log(page);
    // If the cache is empty or has expired, fetch the data from the API
    if (!weatherData || Date.now() - cache.timestamp > cacheExpiry) {
      const cities = ["Paris", "London", "New York", "Tokyo", "Berlin", "Rome", "Madrid", "Moscow",
 "Beijing", "Dubai", "Istanbul", "Shanghai", "Mumbai", "São Paulo", "Jakarta", "Seoul", 
 "Kuala Lumpur", "Mexico City", "Lima", "Bangkok", "Tehran", "Cairo", "Riyadh", "Hanoi", "Manila", 
 "Ho Chi Minh City", "Baghdad", "Toronto", "Sydney", "Buenos Aires"];
// console.log(cities);
      weatherData = [];
      for (const city of cities) {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        );
        weatherData.push(weatherResponse.data);
      }

      // Update the cache
      cache.weatherData = weatherData;
      cache.timestamp = Date.now();
      // console.log(weatherData);
    }
   
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    const paginatedWeatherData = weatherData.slice(startIndex, endIndex);
    console.log(paginatedWeatherData);
    console.log("bs");
    res.status(200).json(paginatedWeatherData);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
