import React, { useState, useEffect, useRef } from 'react';
import { Cloud, Thermometer, Droplets, Wind, Sun, CloudRain, MapPin } from 'lucide-react';
import { api } from '../../utils/api';
import { apiEndpoints } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';
import Toast from '../UI/Toast';

const WeatherPage: React.FC = () => {
  type User = { location?: string; [key: string]: any };
  const [user, setUser] = useState<User | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [days, setDays] = useState(7);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
  const userString = localStorage.getItem('julishatokenuser');
  if (userString !== null) {
    const u = JSON.parse(userString);
    setUser(u);
  }

  // Attempt to get browser geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude},${position.coords.longitude}`;
        setLocation(coords);
        fetchWeatherData(coords);
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        setToast({ message: 'Unable to access location. Enter it manually.', type: 'error' });
      }
    );
  } else {
    setToast({ message: 'Geolocation is not supported by your browser.', type: 'error' });
  }
}, []);


const fetchWeatherData = async (locParam?: string) => {
  const locStr = locParam ?? location;
  if (!locStr) return;

  setLoading(true);
  try {
          const token = localStorage.getItem('julishatoken');

    const response = await api.get(
      `${apiEndpoints.weather.forecast}?location=${encodeURIComponent(locStr)}&days=${days}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    setWeatherData(response);
    setLoading(false)
    console.log(response)
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    setToast({ message: 'Failed to load weather data', type: 'error' });
    // Set fallback data
    setWeatherData({
      location: locStr,
      forecast: []
    });
  } finally {
    setLoading(false);
  }
};

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
      return <Sun className="h-8 w-8 text-yellow-500" />;
    }
    if (lowerCondition.includes('cloud')) {
      return <Cloud className="h-8 w-8 text-gray-500" />;
    }
    if (lowerCondition.includes('rain')) {
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    }
    return <Cloud className="h-8 w-8 text-gray-500" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCurrentWeather = () => {
    if (!weatherData?.forecast?.length) return null;
    return weatherData.forecast[0];
  };

  const currentWeather = getCurrentWeather();
  const normalizeForecast = (forecast: any) => {
  return {
    ...forecast,
    temperature: {
      current: forecast.temperature || forecast.temperature?.current || '--',
      max: forecast.temperature?.max || forecast.temperature || '--',
      min: forecast.temperature?.min || forecast.temperature || '--',
    },
    humidity: forecast.humidity,
    wind_speed: forecast.windSpeed || forecast.wind_speed,
    conditions: forecast.conditions || forecast.source || 'Unknown',
    rainfall: forecast.rainfall || 0,
    date: forecast.forecastDate || forecast.date,
  };
};


  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Weather Forecast</h1>
          <p className="text-sm text-gray-600">Stay informed about weather conditions</p>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">{weatherData?.location || location}</span>
        </div>
      </div>

      {/* Location and Days Selector */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} />

          </div>
          
          <div>
            <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">
              Forecast Days
            </label>
            <select
              id="days"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              <option value={3}>3 Days</option>
              <option value={5}>5 Days</option>
              <option value={7}>7 Days</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => fetchWeatherData()}
              disabled={loading || !location}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Loading...' : 'Get Forecast'}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          {/* Current Weather */}
          {currentWeather && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Weather</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(currentWeather.conditions)}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {currentWeather.temperature?.current || currentWeather.temperature?.max || '--'}°C
                  </div>
                  <div className="text-sm text-gray-600">{currentWeather.conditions}</div>
                </div>

                <div className="flex items-center space-x-3">
                  <Thermometer className="h-6 w-6 text-red-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Temperature</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {currentWeather.temperature?.max || '--'}°C / {currentWeather.temperature?.min || '--'}°C
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Droplets className="h-6 w-6 text-blue-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Humidity</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {currentWeather.humidity || '--'}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Wind className="h-6 w-6 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Wind Speed</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {currentWeather.wind_speed || '--'} km/h
                    </div>
                  </div>
                </div>
              </div>

              {currentWeather.rainfall > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CloudRain className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Rainfall: {currentWeather.rainfall}mm
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Forecast */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {days}-Day Forecast
            </h2>
            
            {weatherData?.forecast?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {weatherData.forecast.map((day: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(day.date)}
                      </div>
                      <div className="flex justify-center">
                        {getWeatherIcon(day.conditions)}
                      </div>
                    </div>
                    
                    <div className="text-center mb-3">
                      <div className="text-xl font-bold text-gray-900">
                        {day.temperature?.max || '--'}°C
                      </div>
                      <div className="text-sm text-gray-600">
                        Low: {day.temperature?.min || '--'}°C
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {day.conditions}
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Humidity:</span>
                        <span>{day.humidity || '--'}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wind:</span>
                        <span>{day.wind_speed || '--'} km/h</span>
                      </div>
                      {day.rainfall > 0 && (
                        <div className="flex justify-between">
                          <span>Rainfall:</span>
                          <span>{day.rainfall}mm</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Cloud className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No forecast data</h3>
                <p className="text-gray-600">
                  Enter a location and click "Get Forecast" to view weather data.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherPage;