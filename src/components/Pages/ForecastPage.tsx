import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../utils/api';

export default function ForecastPage() {
  const [forecast, setForecast] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const data = fetchWithAuth('/farmer/forecast/recent')
    setForecast(data)
      
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!forecast) return <div>Loading forecast...</div>;

  return (
    <div className="p-4 bg-blue-50 rounded-md">
      <h2 className="text-xl font-bold mb-2">Recent Forecast</h2>
      <p>Temperature: {forecast.temperature}°C</p>
      <p>Humidity: {forecast.humidity}%</p>
      <p>Rainfall: {forecast.rainfall} mm</p>
      <p>Wind Speed: {forecast.windSpeed} km/h</p>
      <p>Date: {new Date(forecast.forecastDate).toLocaleString()}</p>
    </div>
  );
}
