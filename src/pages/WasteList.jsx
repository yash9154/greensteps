import React, { useEffect, useState } from 'react';
import { wasteAPI } from '../services/api';
import '../styles/waste.css';

export const WasteList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await wasteAPI.getWasteList(page, 20);
        setRecords(response.data.records);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load waste records');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [page]);

  const handleDelete = async (recordId) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        await wasteAPI.deleteWaste(recordId);
        setRecords(records.filter((r) => r.record_id !== recordId));
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete record');
      }
    }
  };

  if (loading) return <div className="loading">Loading records...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="waste-container">
      <h1>📋 My Waste Records</h1>

      {records.length === 0 ? (
        <p className="no-data">No waste records yet. Start tracking!</p>
      ) : (
        <div className="records-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.record_id}>
                  <td>{record.entry_date}</td>
                  <td>{record.display_name}</td>
                  <td>{record.quantity}</td>
                  <td>{record.unit}</td>
                  <td>{record.notes || '-'}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(record.record_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <button
          className="btn-secondary"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button className="btn-secondary" onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};
