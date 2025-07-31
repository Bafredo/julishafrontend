// pages/officer/SendAlertsPage.tsx
import { useState } from 'react';
import { fetchWithAuth } from '../../../utils/api';

const TABS = ['Notification', 'Manual Alert', 'AI-Generated Alert'];

const SendAlertsPage = () => {
  const [tab, setTab] = useState('Notification');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [roleFilter, setRoleFilter] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const sendNotification = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/officer/notifications', {
        method: 'POST',
        body: JSON.stringify({ title, body, roleFilter })
      });
      const data = await res.json();
      setResult(`Notification sent to ${data.count} users`);
    } catch (err) {
      setResult('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const sendAlert = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/officer/alerts', {
        method: 'POST',
        body: JSON.stringify({ title, message: body, severity })
      });
      const data = await res.json();
      setResult(`Alert sent successfully`);
    } catch (err) {
      setResult('Failed to send alert');
    } finally {
      setLoading(false);
    }
  };

  const generateAIAlert = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/officer/alerts/ai', {
        method: 'POST'
      });
      const data = await res.json();
      setResult(`AI Alert generated: ${data.alert?.title}`);
    } catch (err) {
      setResult('Failed to generate AI alert');
    } finally {
      setLoading(false);
    }
  };

  const renderInputs = () => (
    <>
      <input
        className="input w-full mt-2"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        className="textarea w-full mt-2"
        rows={4}
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Message body"
      />
    </>
  );

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Communications Center</h1>

      <div className="flex space-x-2 mb-4">
        {TABS.map(t => (
          <button
            key={t}
            className={`px-4 py-2 rounded ${tab === t ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setResult('');
              setTab(t);
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Notification' && (
        <>
          {renderInputs()}
          <select
            className="select mt-2 w-full"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="farmer">Farmers</option>
            <option value="officer">Officers</option>
          </select>
          <button
            className="btn btn-primary mt-4"
            onClick={sendNotification}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Notification'}
          </button>
        </>
      )}

      {tab === 'Manual Alert' && (
        <>
          {renderInputs()}
          <select
            className="select mt-2 w-full"
            value={severity}
            onChange={e => setSeverity(e.target.value)}
          >
            <option value="low">Low Severity</option>
            <option value="medium">Medium Severity</option>
            <option value="high">High Severity</option>
          </select>
          <button
            className="btn btn-warning mt-4"
            onClick={sendAlert}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Alert'}
          </button>
        </>
      )}

      {tab === 'AI-Generated Alert' && (
        <>
          <p className="text-gray-600 mb-4">Generate a smart alert from weather + sensor conditions</p>
          <button
            className="btn btn-accent"
            onClick={generateAIAlert}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate AI Alert'}
          </button>
        </>
      )}

      {result && <div className="mt-4 text-green-600 font-medium">{result}</div>}
    </div>
  );
};

export default SendAlertsPage;
