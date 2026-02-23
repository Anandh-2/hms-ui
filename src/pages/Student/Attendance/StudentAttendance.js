import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout/Layout';
import { attendanceAPI } from '../../../services/api';
import './StudentAttendance.css';

const StudentAttendance = () => {
  const [status, setStatus] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    from_date: '',
    to_date: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 200,
        ...(filters.from_date && { from_date: filters.from_date }),
        ...(filters.to_date && { to_date: filters.to_date }),
      };

      const [statusRes, logsRes] = await Promise.all([
        attendanceAPI.getMyStatus(),
        attendanceAPI.getMyLogs(params),
      ]);

      setStatus(statusRes.data);
      setLogs(logsRes.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to fetch attendance details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({ from_date: '', to_date: '' });
  };

  return (
    <Layout title="My Attendance">
      <div className="student-attendance-page">
        <div className="status-card">
          <h2>Current Status</h2>
          {status ? (
            <>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`status-text ${status.is_present ? 'present' : 'outside'}`}>
                  {status.college_leave?.status === 'inside_hostel'
                    ? 'Inside Hostel (College Leave)'
                    : status.is_present
                      ? 'Present'
                      : 'Outside'}
                </span>
              </p>
              <p><strong>Last Updated:</strong> {status.last_updated ? new Date(status.last_updated).toLocaleString() : 'No logs yet'}</p>
              {status.college_leave?.reason && (
                <p><strong>College Leave Reason:</strong> {status.college_leave.reason}</p>
              )}
            </>
          ) : (
            <p className="no-data">No status available</p>
          )}
        </div>

        <div className="logs-card">
          <div className="toolbar">
            <input
              type="date"
              name="from_date"
              value={filters.from_date}
              onChange={handleChange}
            />
            <input
              type="date"
              name="to_date"
              value={filters.to_date}
              onChange={handleChange}
            />
            <button className="btn-secondary" onClick={fetchData}>Apply</button>
            <button className="btn-secondary" onClick={clearFilters}>Clear</button>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : logs.length === 0 ? (
            <p className="no-data">No attendance logs found</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Log Type</th>
                    <th>RFID Tag</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                      <td>
                        <span className={`badge ${log.log_type}`}>{log.log_type}</span>
                      </td>
                      <td>{log.rfid_tag || 'N/A'}</td>
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

export default StudentAttendance;
