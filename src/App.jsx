import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import L from "leaflet";
import "./weatherApp.css"; // Import your custom CSS

// Define a custom icon for the map marker
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function App() {
  const [city, setCity] = useState(""); // For user input
  const [weather, setWeather] = useState(null); // Weather data
  const [error, setError] = useState(""); // Error messages
  const [cityCoordinates, setCityCoordinates] = useState(null); // City coordinates

  const API_KEY = "6330cbba243f559d277a832494925b40"; // Replace with your OpenWeatherMap API key

  // Fetch weather and location data
  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city.");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data); // Save weather data
      setCityCoordinates({
        lat: response.data.coord.lat,
        lon: response.data.coord.lon,
      }); // Save coordinates
      setError(""); // Clear any errors
    } catch (err) {
      setError("City not found. Please try again.");
      setWeather(null);
      setCityCoordinates(null);
    }
  };

  return (
    <div className="app-container">
      {/* Header Section */}
      <header>
        <p>Enter a city name to view its weather and location.</p>
      </header>

      {/* Input Section */}
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input-box"
        />
        <button onClick={fetchWeather} className="search-button">
          Get Weather
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Weather Details */}
      {weather && (
        <div className="weather-details">
          <h2 className="city-name">{weather.name}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Condition: {weather.weather[0].description}</p>
        </div>
      )}

      {/* Map Display */}
      {cityCoordinates && (
        <div className="map-container">
          <MapContainer
            center={[cityCoordinates.lat, cityCoordinates.lon]}
            zoom={10}
            className="leaflet-map"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />
            <Marker
              position={[cityCoordinates.lat, cityCoordinates.lon]}
              icon={customIcon}
            >
              <Popup>
                <strong>{weather.name}</strong> <br />
                {weather.weather[0].description}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default App;
