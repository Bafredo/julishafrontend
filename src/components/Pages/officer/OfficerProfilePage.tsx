// pages/officer/ProfilePage.tsx
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../../utils/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then(res => res.json())
      .then(setProfile);
  }, []);

  const updateProfile = async () => {
    setSaving(true);
    const res = await fetchWithAuth('/officer/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    const data = await res.json();
    console.log(data)
    setProfile(data);
    setSaving(false);
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-bold mb-4">Officer Profile</h1>
      <input className="input mb-2" value={profile.fullName || ''} onChange={e => setProfile({ ...profile, fullName: e.target.value })} />
      <input className="input mb-2" value={profile.email || ''} onChange={e => setProfile({ ...profile, email: e.target.value })} />
      <input className="input mb-2" value={profile.phoneNumber || ''} onChange={e => setProfile({ ...profile, phoneNumber: e.target.value })} />
      <button onClick={updateProfile} className="btn">{saving ? "Saving..." : "Update"}</button>
    </div>
  );
};

export default ProfilePage;
