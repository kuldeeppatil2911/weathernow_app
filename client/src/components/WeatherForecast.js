import React from 'react';
import { Calendar, Thermometer, Droplets, Wind } from 'lucide-react';
import './WeatherForecast.css';

const WeatherForecast = ({ data, className = '' }) => {
  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className={`weather-forecast ${className} bounce-in`}>
      <div className="forecast-header">
        <Calendar size={20} />
        <h3>5-Day Forecast</h3>
      </div>
      
      <div className="forecast-container">
        {data.map((day, index) => (
          <div key={index} className="forecast-day">
            <div className="forecast-date">
              <span className="day-name">{getDayName(day.date)}</span>
              <span className="date-text">{formatDate(day.date)}</span>
            </div>
            
            <div className="forecast-icon">
              <img 
                src={getWeatherIcon(day.icon)} 
                alt={day.description}
                width="50"
                height="50"
              />
              <span className="forecast-description">{day.description}</span>
            </div>
            
            <div className="forecast-temps">
              <div className="temp-high">
                <Thermometer size={16} />
                <span>{Math.round(day.temp_max)}°</span>
              </div>
              <div className="temp-low">
                <Thermometer size={16} />
                <span>{Math.round(day.temp_min)}°</span>
              </div>
            </div>
            
            <div className="forecast-details">
              <div className="detail-row">
                <Droplets size={14} />
                <span>{day.humidity}%</span>
              </div>
              <div className="detail-row">
                <Wind size={14} />
                <span>{day.wind_speed} m/s</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;
