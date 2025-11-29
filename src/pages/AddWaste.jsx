import React, { useState, useEffect } from 'react';
import { wasteAPI } from '../services/api';
import '../styles/waste.css';

export const AddWaste = () => {
  const [wasteTypes, setWasteTypes] = useState([]);
  const [formData, setFormData] = useState({
    entry_date: new Date().toISOString().split('T')[0],
    waste_type_id: '',
    quantity: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWasteTypes = async () => {
      try {
        const response = await wasteAPI.getWasteTypes();
        setWasteTypes(response.data.types);
      } catch (err) {
        setError('Failed to load waste types');
      }
    };

    fetchWasteTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await wasteAPI.addWaste(formData);
      setSuccess('Waste entry added successfully!');
      setFormData({
        entry_date: new Date().toISOString().split('T')[0],
        waste_type_id: '',
        quantity: '',
        notes: '',
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add waste entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="waste-container">
      <h1>➕ Add Waste Entry</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="waste-form">
        <div className="form-group">
          <label htmlFor="entry_date">Date</label>
          <input
            type="date"
            id="entry_date"
            name="entry_date"
            value={formData.entry_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="waste_type_id">Waste Type</label>
          <select
            id="waste_type_id"
            name="waste_type_id"
            value={formData.waste_type_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Select a type --</option>
            {wasteTypes.map((type) => (
              <option key={type.waste_type_id} value={type.waste_type_id}>
                {type.display_name} ({type.unit})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity (kg)</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Add any additional details..."
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Waste Entry'}
        </button>
      </form>
    </div>
  );
};
