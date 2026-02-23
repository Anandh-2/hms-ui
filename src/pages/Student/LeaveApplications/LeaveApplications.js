import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout/Layout';
import { holidayLeaveAPI } from '../../../services/api';
import './LeaveApplications.css';

const StudentLeaveApplications = () => {
  const [formData, setFormData] = useState({
    from_date: '',
    to_date: '',
    reason: '',
  });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await holidayLeaveAPI.getMyApplications();
      setApplications(response.data || []);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to fetch leave applications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await holidayLeaveAPI.apply(formData);
      alert('Leave application submitted successfully');
      setFormData({ from_date: '', to_date: '', reason: '' });
      fetchApplications();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this pending application?')) {
      return;
    }

    try {
      await holidayLeaveAPI.delete(id);
      alert('Application cancelled');
      fetchApplications();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel application');
    }
  };

  return (
    <Layout title="Holiday Leave Applications">
      <div className="student-leave-page">
        <form className="card" onSubmit={handleSubmit}>
          <h2>Apply for Holiday Leave</h2>

          <div className="form-group">
            <label htmlFor="from_date">From Date</label>
            <input
              id="from_date"
              type="date"
              value={formData.from_date}
              onChange={(e) => setFormData((prev) => ({ ...prev, from_date: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="to_date">To Date</label>
            <input
              id="to_date"
              type="date"
              value={formData.to_date}
              onChange={(e) => setFormData((prev) => ({ ...prev, to_date: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reason">Reason</label>
            <textarea
              id="reason"
              rows="4"
              value={formData.reason}
              onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
              required
              placeholder="Mention reason for holiday leave"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>

        <div className="card">
          <h2>My Applications</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : applications.length === 0 ? (
            <p className="no-data">No applications submitted yet</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Applied On</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Status</th>
                    <th>Remarks</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>{new Date(app.applied_at).toLocaleString()}</td>
                      <td>{new Date(app.from_date).toLocaleDateString()}</td>
                      <td>{new Date(app.to_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`status ${app.status}`}>{app.status}</span>
                      </td>
                      <td>{app.remarks || '-'}</td>
                      <td>
                        {app.status === 'pending' ? (
                          <button className="btn-danger" onClick={() => handleCancel(app.id)}>
                            Cancel
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

export default StudentLeaveApplications;
