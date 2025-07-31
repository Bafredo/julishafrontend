import React from 'react';
import {
  Cpu,
  MemoryStick,
  Database,
  Rss,
  RadioTower,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const SystemStats = () => {
  const stats = {
    cpuUsage: 63, // %
    ramUsage: 78, // %
    dbStatus: true,
    loraStatus: true,
    mqttStatus: true,
  };

  const statusBadge = (status: boolean) => (
    <span
      className={`px-2 py-1 text-xs rounded-full ${
        status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      } flex items-center gap-1`}
    >
      {status ? <CheckCircle size={14} /> : <XCircle size={14} />}
      {status ? 'Online' : 'Offline'}
    </span>
  );

  const usageBar = (value: number, color = 'bg-blue-500') => (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div className={`${color} h-full`} style={{ width: `${value}%` }} />
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">System Health</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CPU Usage */}
        <div className="bg-white shadow-md rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <Cpu /> CPU Usage
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.cpuUsage}%</div>
          {usageBar(stats.cpuUsage)}
        </div>

        {/* RAM Usage */}
        <div className="bg-white shadow-md rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <MemoryStick /> RAM Usage
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.ramUsage}%</div>
          {usageBar(stats.ramUsage, 'bg-purple-500')}
        </div>

        {/* Database Status */}
        <div className="bg-white shadow-md rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <Database /> Database
          </div>
          {statusBadge(stats.dbStatus)}
        </div>

        {/* LoRaWAN Status */}
        <div className="bg-white shadow-md rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <RadioTower /> LoRaWAN Gateway
          </div>
          {statusBadge(stats.loraStatus)}
        </div>

        {/* MQTT Broker Status */}
        <div className="bg-white shadow-md rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <Rss /> MQTT Broker
          </div>
          {statusBadge(stats.mqttStatus)}
        </div>
      </div>
    </div>
  );
};

export default SystemStats;
