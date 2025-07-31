import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../utils/api';

type Device = {
  _id: string;
  name: string;
  deviceType: string;
  isActive: boolean;
  location?: { name: string };
};

const DeviceManager: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [name, setName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth('/officer/devices', {
      });
      const data = res;
      setDevices(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch devices');
      setLoading(false);
    }
  };

  const addDevice = async () => {
    if (!name || !deviceType) return alert('All fields required');

    try {
      const res = await fetchWithAuth('/officer/devices', {
        method: 'POST',
        body: JSON.stringify({ name, deviceId,deviceType }),
      });

      if (!res) throw new Error('Error adding device');

      await fetchDevices();
      setName('');
      setDeviceType('');
    } catch (err) {
      alert('Failed to add device');
    }
  };

  const deleteDevice = async (id: string) => {
    if (!confirm('Are you sure you want to remove this device?')) return;
    try {
      await fetch(`/api/devices/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      await fetchDevices();
    } catch (err) {
      alert('Failed to delete device');
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Devices</h2>

      {/* Add Device Form */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h3 className="text-xl font-semibold mb-2">Add New Device</h3>
        <input
          className="border p-2 mr-2 mb-2"
          type="text"
          placeholder="Device ID"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
        />
        <input
          className="border p-2 mr-2 mb-2"
          type="text"
          placeholder="Device Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 mr-2 mb-2"
          type="text"
          placeholder="Device Type"
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={addDevice}
        >
          Add Device
        </button>
      </div>

      {/* Device List */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Devices in Your Region</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : devices.length === 0 ? (
          <p>No devices found.</p>
        ) : (
          <ul className="space-y-3">
            {devices.map((device) => (
              <li
                key={device._id}
                className="flex justify-between items-center bg-white shadow p-4 rounded"
              >
                <div>
                  <p className="font-bold">{device.name}</p>
                  <p className="text-sm text-gray-600">{device.deviceType}</p>
                  <p className={`text-sm ${device.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {device.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => deleteDevice(device._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DeviceManager;
