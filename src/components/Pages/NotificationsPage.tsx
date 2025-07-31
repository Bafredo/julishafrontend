import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../utils/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWithAuth('/farmer/notifications')
      .then(setNotifications)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Notifications</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {notifications.map((note: any) => (
          <li key={note._id} className="bg-yellow-50 p-3 rounded">
            <p>{note.title}</p>
            <p className="text-sm">{new Date(note.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
