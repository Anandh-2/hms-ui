import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout/Layout';
import { collegeLeaveAPI } from '../../../services/api';
import './CollegeLeave.css';

const CollegeLeave = () => {
  const today = new Date().toISOString().slice(0, 10);
  const [formData, setFormData] = useState({
    date: today,
    reason: '',
  });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMyRecords();
  }, []);

  const fetchMyRecords = async () => {
    try {
      setLoading(true);
      const response = await collegeLeaveAPI.getMyRecords();
      setRecords(response.data || []);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to fetch college leave records');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await collegeLeaveAPI.create(formData);
      alert('College leave marked successfully');
      setFormData((prev) => ({ ...prev, reason: '' }));
      fetchMyRecords();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to mark college leave');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this college leave record for today?')) {
      return;
    }

    try {
      await collegeLeaveAPI.delete(id);
      alert('Record removed');
      fetchMyRecords();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to remove record');
    }
  };

  return (
    <Layout title="College Leave">
      <div className="student-college-leave-page">
        <form className="card" onSubmit={handleSubmit}>
          <h2>Mark College Leave (Inside Hostel)</h2>
          <p className="help-text">Use this on working days if you are staying in hostel instead of going to college.</p>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reason">Reason</label>
            <textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
              rows="4"
              required
              placeholder="Mention reason for college leave"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Mark Leave'}
          </button>
        </form>

        <div className="card">
          <h2>My Recent College Leave Records</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : records.length === 0 ? (
            <p className="no-data">No records found</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Reason</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>{record.status === 'inside_hostel' ? 'Inside Hostel' : 'At College'}</td>
                      <td>{record.reason}</td>
                      <td>
                        {record.date === today ? (
                          <button className="btn-danger" onClick={() => handleDelete(record.id)}>
                            Delete
                          </button>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CollegeLeave;
