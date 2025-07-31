import { useState } from 'react';
import { fetchWithAuth } from '../../utils/api';

export default function AdvicePage() {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/farmer/generate-advice', { method: 'POST' });
      setAdvice(res.advice);
    } catch (err) {
      setAdvice(
        'Error generating advice: ' +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <button onClick={handleGenerate} className="bg-green-500 text-white px-4 py-2 rounded">
        {loading ? 'Generating...' : 'Generate Farm Advice'}
      </button>
      {advice && <p className="whitespace-pre-line bg-gray-100 p-4 rounded">{advice}</p>}
    </div>
  );
}
