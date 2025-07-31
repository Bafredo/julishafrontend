import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../utils/api';

export default function ReadingsPage() {
  const [readings, setReadings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () =>{
      const data = await fetchWithAuth('/farmer/readings/recent')
      console.log(data[0].value[0])
      setReadings(data[0].value)
      
    }
    fetch()
    
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!readings.length) return <div>No recent readings.</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Recent Sensor Readings</h2>
      <ul className="space-y-2">
        {readings.map((r: any, i) => (
          <li key={i} className="bg-white shadow p-3 rounded">
            <p><strong>Humidity</strong>: {r.humidity}</p>
            <p><strong>Rainfall</strong>: {r.rainfall}</p>
            <p><strong>uVIndex</strong>: {r.uvIndex}</p>
            <p><strong>windSpeed</strong>: {r.windSpeed}</p>
            <p className="text-sm text-gray-500">{new Date(r.updatedAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
