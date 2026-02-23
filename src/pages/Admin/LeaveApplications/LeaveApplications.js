import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import { holidayLeaveAPI } from '../../../services/api';
import './LeaveApplications.css';

const LeaveApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedApp, setSelectedApp] = useState(null);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await holidayLeaveAPI.getAll(params);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      alert('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appId) => {
    try {
      await holidayLeaveAPI.update(appId, { status: 'approved', remarks });
      alert('Application approved successfully');
      setSelectedApp(null);
      setRemarks('');
      fetchApplications();
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Failed to approve application');
    }
  };

  const handleReject = async (appId) => {
    if (!remarks) {
      alert('Please provide a reason for rejection');
      return;
    }
    try {
      await holidayLeaveAPI.update(appId, { status: 'rejected', remarks });
      alert('Application rejected');
      setSelectedApp(null);
      setRemarks('');
      fetchApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Failed to reject application');
    }
  };

  const pendingCount = applications.filter(app => app.status === 'pending').length;
  const approvedCount = applications.filter(app => app.status === 'approved').length;
  const rejectedCount = applications.filter(app => app.status === 'rejected').length;

  return (
    <Layout title="Leave Applications">
      <div className="leave-applications">
        <div className="stats-row">
          <div className="stat-card pending">
            <h3>Pending</h3>
            <p className="stat-number">{pendingCount}</p>
          </div>
          <div className="stat-card approved">
            <h3>Approved</h3>
            <p className="stat-number">{approvedCount}</p>
          </div>
          <div className="stat-card rejected">
            <h3>Rejected</h3>
            <p className="stat-number">{rejectedCount}</p>
          </div>
          <div className="stat-card total">
            <h3>Total</h3>
            <p className="stat-number">{applications.length}</p>
          </div>
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({pendingCount})
          </button>
          <button
            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved ({approvedCount})
          </button>
          <button
            className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected ({rejectedCount})
          </button>
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="no-data">No applications found</div>
        ) : (
          <div className="applications-grid">
            {applications.map((app) => (
              <div key={app.id} className={`application-card ${app.status}`}>
                <div className="card-header">
                  <div className="student-info">
                    <h3>{app.first_name} {app.last_name}</h3>
                    <p className="student-id">{app.student_number} • Room {app.room_number}</p>
                  </div>
                  <span className={`status-badge ${app.status}`}>
                    {app.status.toUpperCase()}
                  </span>
                </div>

                <div className="card-body">
                  <div className="date-range">
                    <div className="date-item">
                      <span className="label">From:</span>
                      <span className="value">{new Date(app.from_date).toLocaleDateString()}</span>
                    </div>
                    <div className="date-item">
                      <span className="label">To:</span>
                      <span className="value">{new Date(app.to_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="label">Duration:</span>
                    <span className="value">
                      {Math.ceil((new Date(app.to_date) - new Date(app.from_date)) / (1000 * 60 * 60 * 24)) + 1} days
                    </span>
                  </div>

                  <div className="info-item">
                    <span className="label">Phone:</span>
                    <span className="value">{app.phone_number}</span>
                  </div>

                  <div className="info-item full-width">
                    <span className="label">Reason:</span>
                    <p className="reason-text">{app.reason}</p>
                  </div>

                  <div className="info-item">
                    <span className="label">Applied:</span>
                    <span className="value">{new Date(app.applied_at).toLocaleString()}</span>
                  </div>
                  
                  {app.status !== 'pending' && (
                    <>
                      <div className="info-item">
                        <span className="label">Reviewed By:</span>
                        <span className="value">{app.approved_by_username || 'N/A'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Reviewed At:</span>
                        <span className="value">
                          {app.reviewed_at ? new Date(app.reviewed_at).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      {app.remarks && (
                        <div className="info-item full-width">
                          <span className="label">Remarks:</span>
                          <p className="remarks-text">{app.remarks}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {app.status === 'pending' && (
                  <div className="card-actions">
                    <button
                      className="btn-review"
                      onClick={() => {
                        setSelectedApp(app);
                        setRemarks('');
                      }}
                    >
                      Review Application
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedApp && (
          <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Review Application</h2>
                <button className="close-btn" onClick={() => setSelectedApp(null)}>×</button>
              </div>

              <div className="modal-body">
                <div className="app-details">
                  <h3>{selectedApp.first_name} {selectedApp.last_name}</h3>
                  <p className="detail-item">
                    <strong>Student ID:</strong> {selectedApp.student_number}
                  </p>
                  <p className="detail-item">
                    <strong>Room:</strong> {selectedApp.room_number}
                  </p>
                  <p className="detail-item">
                    <strong>Phone:</strong> {selectedApp.phone_number}
                  </p>
                  <p className="detail-item">
                    <strong>Duration:</strong> {new Date(selectedApp.from_date).toLocaleDateString()} to {new Date(selectedApp.to_date).toLocaleDateString()}
                  </p>
                  <div className="detail-item">
                    <strong>Reason:</strong>
                    <p className="reason-detail">{selectedApp.reason}</p>
                  </div>
                </div>

                <div className="form-group">
                  <label>Remarks</label>
                  <small>(Optional for approval, Required for rejection)</small>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows="4"
                    placeholder="Enter your remarks..."
                  />
                </div>

                <div className="modal-actions">
                  <button className="btn-reject" onClick={() => handleReject(selectedApp.id)}>
                    Reject Application
                  </button>
                  <button className="btn-approve" onClick={() => handleApprove(selectedApp.id)}>
                    Approve Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LeaveApplications;
