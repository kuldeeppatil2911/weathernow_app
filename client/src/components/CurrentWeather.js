import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  Sunrise, 
  Sunset,
  MapPin
} from 'lucide-react';
import './CurrentWeather.css';

const CurrentWeather = ({ data, className = '' }) => {
  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  return (
    <div className={`current-weather ${className} bounce-in`}>
      <div className="weather-main">
        <div className="weather-location">
          <MapPin size={20} />
          <h2>{data.city}, {data.country}</h2>
        </div>
        
        <div className="weather-primary">
          <div className="weather-icon">
            <img 
              src={getWeatherIcon(data.icon)} 
              alt={data.description}
              width="100"
              height="100"
            />
          </div>
          
          <div className="weather-temp">
            <span className="temp-value">{data.temperature}°C</span>
            <span className="temp-feels-like">Feels like {data.feels_like}°C</span>
            <span className="weather-description">{data.description}</span>
          </div>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-grid">
          <div className="detail-item">
            <div className="detail-icon">
              <Thermometer size={20} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Temperature</span>
              <span className="detail-value">{data.temperature}°C</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <Droplets size={20} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Humidity</span>
              <span className="detail-value">{data.humidity}%</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <Wind size={20} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Wind</span>
              <span className="detail-value">
                {data.wind_speed} m/s {getWindDirection(data.wind_direction)}
              </span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <Gauge size={20} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Pressure</span>
              <span className="detail-value">{data.pressure} hPa</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <Sunrise size={20} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Sunrise</span>
              <span className="detail-value">{data.sunrise}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <Sunset size={20} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Sunset</span>
              <span className="detail-value">{data.sunset}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="weather-timestamp">
        <small>Last updated: {formatTime(data.timestamp)}</small>
      </div>
    </div>
  );
};

export default CurrentWeather;
