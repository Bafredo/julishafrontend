import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, MessageCircle, Activity, Send, TrendingUp } from 'lucide-react';
import { api } from '../../utils/api';
import { apiEndpoints } from '../../config/api';
import Toast from '../UI/Toast';
import SendAlertModal from '../Modals/SendAlertModal';
import DeviceManager from '../Pages/DeviceManager';

const OfficerDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSendAlert, setShowSendAlert] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('julishatoken')
      const response = await api.get(apiEndpoints.officer.dashboard,{
        headers:{
          'Authorization': `Bearer ${token}`
        }
      });
      setDashboardData(response);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setToast({ 
        message: 'Failed to load dashboard data', 
        type: 'error' 
      });
      // Set fallback data
      setDashboardData({
        region: 'Unknown Region',
        stats: {
          total_farmers: 0,
          total_alerts: 0,
          total_advisories: 0,
          sensor_readings: 0
        },
        recentAlerts: [],
        recentAdvisories: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendAlert = async (alertData: any) => {
    console.log(alertData)
    try {
      const token = localStorage.getItem('julishatoken')
      await api.post(apiEndpoints.officer.sendAlert,{
        title: alertData.title,
    message: alertData.message,
    severity: alertData.severity
      },{
          headers:{
              'Authorization':`Bearer ${token}`
          },
      });
      setToast({ message: 'Alert sent successfully!', type: 'success' });
      setShowSendAlert(false);
      // Refresh dashboard data
      fetchDashboardData();
    } catch (error) {
      setToast({ 
        message: error instanceof Error ? error.message : 'Failed to send alert', 
        type: 'error' 
      });
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Officer Dashboard</h1>
          <p className="text-sm text-gray-600">Region: {dashboardData?.region}</p>
        </div>
        <button 
          onClick={() => setShowSendAlert(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Send className="h-4 w-4" />
          <span>Send Alert</span>
        </button>
      </div>

      {/* Region Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Farmers</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.stats?.total_farmers?.toLocaleString() || '0'}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.stats?.total_alerts || '0'}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-orange-600">3 high priority</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sent Advisories</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.stats?.total_advisories || '0'}
              </p>
            </div>
            <MessageCircle className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">This month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sensor Readings</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.stats?.sensor_readings?.toLocaleString() || '0'}
              </p>
            </div>
            <Activity className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">All operational</span>
          </div>
        </div>
      </div>

      <DeviceManager/>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h2>
          <div className="space-y-4">
            {dashboardData?.recentAlerts?.slice(0, 3).map((alert: any) => (
              <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{alert.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(alert.created_at)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            )) || (
              <div className="text-center text-gray-500 py-4">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No recent alerts</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Advisories */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Advisories</h2>
          <div className="space-y-4">
            {dashboardData?.recentAdvisories?.slice(0, 3).map((advisory: any) => (
              <div key={advisory.id} className="border border-gray-200 rounded-lg p-4">
                <div className="text-sm text-gray-900">{advisory.content}</div>
                <p className="text-xs text-gray-500 mt-2">
                  {formatDate(advisory.created_at)}
                </p>
              </div>
            )) || (
              <div className="text-center text-gray-500 py-4">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No recent advisories</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showSendAlert && (
        <SendAlertModal
          onClose={() => setShowSendAlert(false)}
          onSend={handleSendAlert}
        />
      )}
    </div>
  );
};

export default OfficerDashboard;