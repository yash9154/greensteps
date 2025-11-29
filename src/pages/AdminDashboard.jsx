import React, { useEffect, useState } from 'react';
import { adminAPI, dashboardAPI } from '../services/api';
import '../styles/admin.css';

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [wasteRecords, setWasteRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'users') {
          const response = await adminAPI.getAllUsers();
          setUsers(response.data.users);
        } else if (activeTab === 'waste') {
          const response = await adminAPI.getAllWaste(100, 0);
          setWasteRecords(response.data.records);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchData();
  }, [activeTab]);

  const handleExportCsv = async () => {
    try {
      const response = await dashboardAPI.exportWasteCsv();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'waste_records.csv');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Failed to export CSV');
    }
  };

  if (loading) return <div className="loading">Loading admin data...</div>;

  return (
    <div className="admin-container">
      <h1>⚙️ Admin Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`tab ${activeTab === 'waste' ? 'active' : ''}`}
          onClick={() => setActiveTab('waste')}
        >
          All Waste Records
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>All Users ({users.length})</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.is_admin ? '✅' : '❌'}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'waste' && (
        <div className="admin-section">
          <div className="admin-actions">
            <h2>All Waste Records ({wasteRecords.length})</h2>
            <button className="btn-export" onClick={handleExportCsv}>
              📥 Export CSV
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Date</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {wasteRecords.map((record) => (
                <tr key={record.record_id}>
                  <td>{record.record_id}</td>
                  <td>{record.name}</td>
                  <td>{record.entry_date}</td>
                  <td>{record.display_name}</td>
                  <td>{record.quantity}</td>
                  <td>{record.unit}</td>
                  <td>{record.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
