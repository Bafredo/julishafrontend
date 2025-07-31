// pages/officer/FarmersPage.tsx
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../../utils/api';

const FarmersPage = () => {
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    const fetchData = async () =>{
      const data = await fetchWithAuth('/officer/users')
      console.log(data)
      setFarmers(data)
    }
    fetchData()
    
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Farmers in Region</h1>
      <div className="grid gap-4">
        {farmers.map((f: any) => (
          <div key={f._id} className="p-4 border rounded bg-white">
            <p><strong>Name:</strong> {f.fullName}</p>
            <p><strong>Email:</strong> {f.email}</p>
            <p><strong>Phone:</strong> {f.phoneNumber}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmersPage;
