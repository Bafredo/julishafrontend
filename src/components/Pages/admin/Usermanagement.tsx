import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../../utils/api';
import RegisterOfficer from './RegisterOfficer';

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'farmer' | 'officer' | 'admin';
  location?: string;
  updatedAt: string;
  prefferedLang?: string;
}

const Usermanagement = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState('');
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<User>>({});

  const fetchUsers = async () => {
    try {
      const data = await fetchWithAuth('/admin/users');
      setAllUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = allUsers.filter((user) =>
    user.fullName.toLowerCase().includes(filter.toLowerCase()) ||
    user.email.toLowerCase().includes(filter.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  };

  const getUserStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await fetchWithAuth(`/admin/users/${id}`, { method: 'DELETE' });
      setAllUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleEditClick = (user: User) => {
    setEditUserId(user._id);
    setEditData(user);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    if (!editUserId) return;
    try {
      await fetchWithAuth(`/admin/users/${editUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      fetchUsers();
      setEditUserId(null);
      setEditData({});
    } catch (err) {
      console.error('Failed to save user:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
    setEditData({});
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-80"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
            <tr>
              <th className="py-3 px-2">User</th>
              <th className="py-3 px-2">Role</th>
              <th className="py-3 px-2">Location</th>
              <th className="py-3 px-2">Last Updated</th>
              <th className="py-3 px-2">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                {editUserId === user._id ? (
                  <>
                    <td className="py-3 px-2">
                      <input
                        className="border px-2 py-1 w-full rounded"
                        name="fullName"
                        value={editData.fullName || ''}
                        onChange={handleEditChange}
                      />
                      <input
                        className="border px-2 py-1 w-full rounded mt-1 text-sm"
                        name="email"
                        value={editData.email || ''}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td className="py-3 px-2">
                      <select
                        name="role"
                        value={editData.role || 'farmer'}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="farmer">Farmer</option>
                        <option value="officer">Officer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-2">
                      <input
                        name="location"
                        value={editData.location || ''}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="py-3 px-2 text-gray-600">N/A</td>
                    <td className="py-3 px-2 flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="text-green-600 text-sm hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-3 px-2">
                      <div>
                        <div className="font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-gray-500 text-xs">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-2 capitalize">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-600">{user.location || 'N/A'}</td>
                    <td className="py-3 px-2 text-gray-600">{formatDate(user.updatedAt)}</td>
                    <td className="py-3 px-2 flex gap-3 items-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getUserStatusColor(
                          user.prefferedLang || 'active'
                        )}`}
                      >
                        {user.prefferedLang || 'active'}
                      </span>
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-blue-600 text-xs hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 text-xs hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="text-center py-6 text-gray-500 text-sm">No users found</div>
        )}
      </div>
      <RegisterOfficer/>
    </div>
  );
};

export default Usermanagement;
