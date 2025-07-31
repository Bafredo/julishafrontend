import React, { useState, useEffect } from 'react';
import { Cloud, Thermometer, Droplets, Wind, AlertTriangle, MessageCircle } from 'lucide-react';
import { api } from '../../utils/api';
import { apiEndpoints } from '../../config/api';
import Toast from '../UI/Toast';
import ReadingsPage from '../Pages/ReadingsPage';

const FarmerDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('julishatoken');
      const response = await api.get(apiEndpoints.farmer.dashboard,{
        headers : {
          'Authorization': `Bearer ${token}`
        }
      });
      setDashboardData(response);
      console.log(response)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setToast({ 
        message: 'Failed to load dashboard data', 
        type: 'error' 
      });
      // Set fallback data
      setDashboardData({
        alerts: [],
        advisories: [],
        weather: {
          current: { temperature: 24, humidity: 68, conditions: 'Partly Cloudy' },
          forecast: []
        },
        unreadCount: { alerts: 0, advisories: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  const markAlertAsRead = async (alertId: string) => {
    try {
      await api.post(apiEndpoints.farmer.markAlertRead(alertId));
      // Refresh dashboard data
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) return '☀️';
    if (lowerCondition.includes('cloud')) return '⛅';
    if (lowerCondition.includes('rain')) return '🌧️';
    if (lowerCondition.includes('storm')) return '⛈️';
    return '🌤️';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
        
        <div className="flex items-center space-x-4">
          
          {dashboardData?.unreadCount?.alerts > 0 && (
            <div className="flex items-center space-x-2 bg-orange-100 px-3 py-1 rounded-full">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">
                {dashboardData.unreadCount.alerts} Unread Alerts
              </span>
            </div>
          )}
          {dashboardData?.unreadCount?.advisories > 0 && (
            <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {dashboardData.unreadCount.advisories} New Advisories
              </span>
            </div>
          )}
        </div>
      </div>

        <ReadingsPage/>

      {/* Weather Widget */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Current Weather</h2>
          <Cloud className="h-6 w-6 text-blue-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {dashboardData?.weather?.current?.temperature || '--'}°C
            </div>
            <div className="text-sm text-gray-600">
              {dashboardData?.weather?.current?.conditions || 'No data'}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-red-500" />
            <div>
              <div className="text-sm font-medium">Temperature</div>
              <div className="text-sm text-gray-600">
                {dashboardData?.weather?.current?.temperature || '--'}°C
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-sm font-medium">Humidity</div>
              <div className="text-sm text-gray-600">
                {dashboardData?.weather?.current?.humidity || '--'}%
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="h-5 w-5 text-gray-500" />
            <div>
              <div className="text-sm font-medium">Wind Speed</div>
              <div className="text-sm text-gray-600">
                {dashboardData?.weather?.current?.wind_speed || '--'} km/h
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">3-Day Forecast</h3>
          <div className="grid grid-cols-3 gap-4">
            {dashboardData?.weather?.forecast?.slice(0, 3).map((day: any, index: number) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-900">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-2xl my-2">{getWeatherIcon(day.conditions)}</div>
                <div className="text-xs text-gray-600">{day.conditions}</div>
                <div className="text-sm mt-1">
                  <span className="font-medium">{day.temperature?.max || '--'}°</span>
                  <span className="text-gray-500 ml-1">{day.temperature?.min || '--'}°</span>
                </div>
              </div>
            )) || (
              <div className="col-span-3 text-center text-gray-500 py-4">
                No forecast data available
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            {dashboardData?.alerts?.slice(0, 3).map((alert: any) => (
              <div 
                key={alert.id} 
                className={`border-l-4 p-3 rounded-r-lg cursor-pointer transition-opacity ${
                  alert.read_by?.[alert.id] ? 'opacity-60' : ''
                } ${
                  alert.severity === 'high' ? 'border-red-400 bg-red-50' :
                  alert.severity === 'medium' ? 'border-yellow-400 bg-yellow-50' :
                  'border-orange-400 bg-orange-50'
                }`}
                onClick={() => !alert.read_by?.[alert.id] && markAlertAsRead(alert.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                    <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {formatDate(alert.created_at)} • {alert.sender_name}
                    </p>
                  </div>
                  <span className={`
                    px-2 py-1 text-xs rounded-full
                    ${alert.severity === 'high' ? 'bg-red-100 text-red-800' : 
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'}
                  `}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            )) || (
              <div className="text-center text-gray-500 py-4">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No alerts available</p>
              </div>
            )}
          </div>
        </div>

        {/* Latest Advisories */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Latest Advisories</h2>
            <MessageCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            {dashboardData?.advisories?.slice(0, 3).map((advisory: any) => (
              <div key={advisory.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="text-sm text-gray-900">{advisory.content}</div>
                <p className="text-xs text-gray-500 mt-2">
                  {formatDate(advisory.created_at)} • {advisory.officer_name}
                </p>
              </div>
            )) || (
              <div className="text-center text-gray-500 py-4">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No advisories available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;