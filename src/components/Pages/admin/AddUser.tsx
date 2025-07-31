import { Mail, MapPin, Phone, Plus, Save, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { api, fetchWithAuth } from '../../../utils/api';
import { apiEndpoints } from '../../../config/api';
import Toast from '../../UI/Toast';

const AddUser = () => {
    const [loading,setLoading] = useState(false)
    const [profileData, setProfileData] = useState({
        fullName: '',
        email:'',
        phoneNumber:  '',
        location: '',
        role : 'officer'
      });
        type LocationType = { _id: string; name: string };
        const [location, setLocation] = useState<LocationType[]>([])
        const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

      const fetchLocation = async () => {
              const response = await api.get(apiEndpoints.common.auth.location);
              const data = await response;
              console.log(data)
              setLocation(data);
            };
      
        useEffect(() => {
            fetchLocation();
        }, []);

      const handleProfileSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
      
          try {
            const response = await fetchWithAuth('/admin/register-officer',{
                method: 'POST',
                body:JSON.stringify(profileData)
            })
            setToast({message : response,type : 'success'})
            setProfileData({
        fullName: '',
        email:'',
        phoneNumber:  '',
        location: '',
        role : 'officer'
    
      })

          } catch (error) {
            // setToast({ message: 'Failed to update profile', type: 'error' });
          } finally {
            setLoading(false);
          }
        };

          const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            setProfileData(prev => ({
              ...prev,
              [e.target.name]: e.target.value
            }));
          };
  return (
    <div className='lg:col-span-2 bg-white rounded-lg shadow-md p-6'>
        {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
        <div className='w-full flex justify-between'>
            <h1>Add Official</h1>
            <Plus onClick={()=>{}}/>
        </div>
        <div>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      id="full_name"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      id="phone_number"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleProfileChange}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      id="location"
                      name="location"
                      value={profileData.location}
                      onChange={handleProfileChange}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    >
                        <option value="">Select location</option>
                    {location.length > 0 &&
                      location.map((item, index) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))
                    }
                  </select>
                  </div>
                </div>

                

                
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
        </div>
    </div>
  )
}

export default AddUser