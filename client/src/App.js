import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherForecast from './components/WeatherForecast';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentCity, setCurrentCity] = useState('');

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default to a popular city if geolocation fails
          fetchWeatherByCity('London');
        }
      );
    } else {
      // Fallback to default city
      fetchWeatherByCity('London');
    }
  }, []);

  const fetchWeatherByCity = async (city) => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(`/api/weather/current?city=${encodeURIComponent(city)}`),
        axios.get(`/api/weather/forecast?city=${encodeURIComponent(city)}`)
      ]);
      
      setWeatherData(currentResponse.data);
      setForecastData(forecastResponse.data);
      setCurrentCity(city);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch weather data');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    
    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(`/api/weather/current?lat=${lat}&lon=${lon}`),
        axios.get(`/api/weather/forecast?lat=${lat}&lon=${lon}`)
      ]);
      
      setWeatherData(currentResponse.data);
      setForecastData(forecastResponse.data);
      setCurrentCity(currentResponse.data.city);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch weather data');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (city) => {
    fetchWeatherByCity(city);
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          setError('Unable to get your location. Please search for a city instead.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1 className="app-title">
            <span className="title-icon">🌤️</span>
            WeatherNow
          </h1>
          <p className="app-subtitle">Your day, your weather, your way</p>
          <div className="welcome-message">
            Get real-time weather updates and forecasts for any city worldwide
          </div>
        </header>

        <SearchBar 
          onSearch={handleSearch} 
          onLocationClick={handleLocationClick}
          currentCity={currentCity}
        />

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {weatherData && (
              <CurrentWeather 
                data={weatherData} 
                className="fade-in"
              />
            )}
            
            {forecastData && (
              <WeatherForecast 
                data={forecastData} 
                className="slide-up"
              />
            )}
          </>
        )}

        {!loading && !weatherData && !error && (
          <div className="welcome-message">
            <h2>Welcome to Weather App!</h2>
            <p>Search for a city or use your current location to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
