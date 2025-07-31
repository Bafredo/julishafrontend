import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, Database, Server, Search, Filter } from 'lucide-react';
import { api, fetchWithAuth } from '../../utils/api';
import { apiEndpoints } from '../../config/api';
import Toast from '../UI/Toast';

export interface User{
  _id : string,
  fullName : string,
  email: string,
  emailVerificationCode: string,
  codeExpiry: Date,
  createdAt: Date,
  isEmailVerified: Boolean,
  isPhoneVerified:Boolean,
  passwordHash: string,
  prefferedLang: string,
  role: string,
  updatedAt: string,
  __v: Number,
  location: string,
  phoneNumber:string
}

const AdminDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetchWithAuth(apiEndpoints.admin.dashboard);
      setDashboardData(response);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setToast({ 
        message: 'Failed to load dashboard data', 
        type: 'error' 
      });
      // Set fallback data
      setDashboardData({
        userStats: {
          total_users: 0,
          total_farmers: 0,
          total_officers: 0,
          total_admins: 0
        },
        alertStats: {
          total_alerts: 0,
          alerts_by_type: {}
        },
        systemStatus: {
          database: 'unknown',
          api: 'unknown',
          sms_service: 'unknown'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetchWithAuth('/admin/users');
      console.log(response)
      setAllUsers(response || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setAllUsers([]);
    }
  };
  const name : string = "Fred"

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUserStatusColor = (status: string) => {
    return status === 'active' ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
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
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">System Status:</span>
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            Online
          </span>
        </div>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.users?.toLocaleString() || '0'}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.alerts || '0'}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Forecasts</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.forecasts || '0'}
              </p>
            </div>
            <Database className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Readings</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.readings || '0'}
              </p>
            </div>
            <Server className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Devices</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.devices || '0'}
              </p>
            </div>
            <Server className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Database</span>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(dashboardData?.systemStatus?.database || 'unknown')}`}>
                {dashboardData?.systemStatus?.database || 'unknown'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">API Server</span>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(dashboardData?.systemStatus?.api || 'unknown')}`}>
                {dashboardData?.systemStatus?.api || 'unknown'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">SMS Service</span>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(dashboardData?.systemStatus?.sms_service || 'unknown')}`}>
                {dashboardData?.systemStatus?.sms_service || 'unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Roles</option>
                <option value="farmer">Farmers</option>
                <option value="officer">Officers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Role</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Region</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Last Active</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div>
                        <div className="font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-gray-500 text-xs">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-600">{ user.location || 'N/A'}</td>
                    <td className="py-3 px-2 text-gray-600">{formatDate(user.updatedAt)}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getUserStatusColor(user.prefferedLang || 'active')}`}>
                        {user.prefferedLang || 'active'}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;