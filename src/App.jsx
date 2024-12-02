import React, { useState } from "react";
import axios from "axios";
import "./weatherApp.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Import the Leaflet CSS in your App.css or index.css
import "leaflet/dist/leaflet.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [cityCoordinates, setCityCoordinates] = useState(null); // For storing city coordinates

  const API_KEY = "6330cbba243f559d277a832494925b40"; // Replace with your OpenWeatherMap API key

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city.");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
      setCityCoordinates({
        lat: response.data.coord.lat,
        lon: response.data.coord.lon,
      });
      setError("");
    } catch (err) {
      setError("City not found. Please try again.");
      setWeather(null);
      setCityCoordinates(null);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", width: "300px" }}
      />
      <button
        onClick={fetchWeather}
        style={{
          padding: "10px 20px",
          marginLeft: "10px",
          fontSize: "16px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Get Weather
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: "20px" }}>
          <h2>{weather.name}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Condition: {weather.weather[0].description}</p>
        </div>
      )}

      {/* Map Display */}
      {cityCoordinates && (
        <div style={{ marginTop: "20px", height: "500px", width: "100%" }}>
          <MapContainer
            center={[cityCoordinates.lat, cityCoordinates.lon]}
            zoom={10}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />
            <Marker position={[cityCoordinates.lat, cityCoordinates.lon]}>
              <Popup>
                {weather.name} <br /> {weather.weather[0].description}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default App;
