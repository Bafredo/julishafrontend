import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../utils/api';
import { apiEndpoints } from '../../config/api';

// Define ToastType if not imported from elsewhere
type ToastType = 'success' | 'error' | 'info' | 'warning';


interface Alert {
  _id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  sender_name: string;
  created_at: string;
  read_by?: Record<string, boolean>;
}

interface AlertsPageProps {
  setToast: (toast: { message: string; type: ToastType }) => void;
}

const AlertsPage: React.FC<AlertsPageProps> = ({ setToast }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('julishatokenuser') || '{}');
  const userId = user?._id;

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('julishatoken');
        const response = await api.get(apiEndpoints.farmer.alerts, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response)

        setAlerts(response.alerts || []);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
        setToast({ message: 'Failed to load alerts', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [setToast]);

  const markAlertAsRead = async (alertId: string) => {
    try {
      const token = localStorage.getItem('julishatoken');
      await api.post(apiEndpoints.farmer.markAlertRead(alertId), {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAlerts(prev =>
        prev.map(alert =>
          alert._id === alertId
            ? {
                ...alert,
                read_by: { ...alert.read_by, [userId]: true }
              }
            : alert
        )
      );
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
      setToast({ message: 'Failed to mark alert as read', type: 'error' });
    }
  };

  const filteredAlerts = useMemo(() => {
    return alerts.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [alerts]);

  const getBadgeClass = (type: 'severity', value: string) => {
    const severityMap = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200',
      default: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return severityMap[value as keyof typeof severityMap] || severityMap.default;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Alerts & Notifications</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading alerts...</div>
      ) : filteredAlerts.length === 0 ? (
        <div className="text-center text-gray-500">No alerts found.</div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map(alert => {
            const isRead = alert.read_by?.[userId];

            return (
              <div
                key={alert._id}
                className={`border rounded-lg p-4 shadow-sm ${
                  isRead ? 'bg-gray-50' : 'bg-white'
                } hover:shadow-md transition duration-150`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">{alert.title}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full border ${getBadgeClass(
                      'severity',
                      alert.severity
                    )}`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="text-gray-700">{alert.message}</p>
                <div className="text-sm text-gray-500 mt-2 flex justify-between">
                  <span>From: {alert.sender_name}</span>
                  <span>
                    {new Date(alert.created_at).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
                {!isRead && (
                  <button
                    onClick={() => markAlertAsRead(alert._id)}
                    className="mt-3 inline-block text-sm text-green-600 hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
