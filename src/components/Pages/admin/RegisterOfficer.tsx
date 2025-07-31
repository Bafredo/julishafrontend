import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../../utils/api';
import { UserPlus, Loader2 } from 'lucide-react';

interface Location {
  _id: string;
  name: string;
}

const RegisterOfficer = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [region, setRegion] = useState('');
  const [location, setLocation] = useState('');

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetchWithAuth('/auth/location');
        const data = res
        setLocations(data);
      } catch (err) {
        console.error('Failed to fetch locations');
      }
    };

    fetchLocations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const officer = {
      fullName,
      email,
      phoneNumber:phone,
      region,
      location,
      role: 'officer',
    };

    try {
      const res = await fetchWithAuth('/admin/register-officer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(officer),
      });

      if (res.ok) {
        setSuccess(true);
        setFullName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setRegion('');
        setLocation('');
      } else {
        console.error('Officer registration failed');
      }
    } catch (err) {
      console.error('Error registering officer:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-4">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <UserPlus className="w-5 h-5 text-green-600" /> Register New Officer
      </h2>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 mt-4">
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          required
          className="border border-gray-300 rounded-md px-4 py-2"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
          className="border border-gray-300 rounded-md px-4 py-2"
        />

        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          required
          className="border border-gray-300 rounded-md px-4 py-2"
        />

        


        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="border border-gray-300 rounded-md px-4 py-2"
        >
          <option value="">Select Location</option>
          {locations
            .map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc.name}
              </option>
            ))}
        </select>

        <div className="col-span-2 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2 w-full"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Register Officer'}
          </button>
          {success && <p className="text-green-600 text-sm mt-2 text-center">Officer registered successfully!</p>}
        </div>
      </form>
    </div>
  );
};

export default RegisterOfficer;
