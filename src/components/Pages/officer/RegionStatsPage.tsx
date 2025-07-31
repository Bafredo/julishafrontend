// pages/officer/RegionStatsPage.tsx
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../../utils/api';

interface Sensor{
    sensorType : string;
    value : string;
    timestamp: number
}

const RegionStatsPage = () => {
  const [readings, setReadings] = useState<Sensor[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchWithAuth('/officer/readings');
      setReadings(data);
      console.log(data)
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Recent Region Readings</h1>
      <div className="grid gap-4">
        {readings.map((r, i) => (
          <div key={i} className="border p-4 rounded bg-white shadow">
            <p><strong>Sensor:</strong> {r.sensorType}</p>
            <p><strong>Value:</strong> {r.value}</p>
            <p><strong>Time:</strong> {new Date(r.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionStatsPage;
