import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../utils/api';
import ForecastPage from './ForecastPage';

interface Advisory {
  _id: string;
  location: string;
  generatedAt: string;
  category: string;
  content_en: string;
  content_sw: string;
  content_local: string;
  forecast?: string;
}

const AdvisoriesPage = () => {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState<'en' | 'sw' | 'local'>('en');
  const [generating, setGenerating] = useState(false);
  const [generatedAdvice, setGeneratedAdvice] = useState<string | null>(null);

  useEffect(() => {
    fetchAdvisories();
  }, []);

  const fetchAdvisories = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/farmer/advisories');
      if (!res) throw new Error('Failed to fetch advisories');
      setAdvisories(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAdvice = async () => {
    setGenerating(true);
    setGeneratedAdvice(null);
    try {
      const res = await fetchWithAuth('/farmer/generate-advice', {
        method: 'POST',
      });
      if (!res?.advice) throw new Error('No advice generated');
      setGeneratedAdvice(res.advice);
      // Optionally refetch advisories list if AI advice is saved
      await fetchAdvisories();
    } catch (err: any) {
      setError('Failed to generate advice: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const getContent = (advisory: Advisory) => {
    if (language === 'sw') return advisory.content_sw;
    if (language === 'local') return advisory.content_local;
    return advisory.content_en;
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Advisories</h1>
      <ForecastPage />

      <div className="flex items-center justify-between mb-4 mt-4">
        <div>
          <label className="mr-2 font-semibold">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="border px-3 py-1 rounded"
          >
            <option value="en">English</option>
            <option value="sw">Swahili</option>
            <option value="local">Local</option>
          </select>
        </div>

        <button
          onClick={handleGenerateAdvice}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow disabled:opacity-50"
          disabled={generating}
        >
          {generating ? 'Generating...' : 'Generate Advice'}
        </button>
      </div>

      {loading && <p>Loading advisories...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && advisories.length === 0 && (
        <p className="text-gray-500">No advisories found for your location.</p>
      )}

      {generatedAdvice && (
        <div className="p-4 my-4 border-l-4 border-green-500 bg-green-50 text-green-800 rounded">
          <strong>AI-Generated Advice:</strong>
          <p>{generatedAdvice}</p>
        </div>
      )}

      <div className="space-y-4">
        {advisories.map((advisory) => (
          <div
            key={advisory._id}
            className="border rounded p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                {formatDate(advisory.generatedAt)}
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                {advisory.category}
              </span>
            </div>
            <p className="text-gray-800">{getContent(advisory)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvisoriesPage;
