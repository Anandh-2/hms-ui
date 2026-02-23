import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import { attendanceAPI } from '../../../services/api';
import './AttendancePage.css';

const AttendancePage = () => {
  const [currentStatus, setCurrentStatus] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('current');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({
    from_date: '',
    to_date: ''
  });

  useEffect(() => {
    fetchCurrentStatus();
  }, []);

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchAttendanceLogs();
    }
  }, [activeTab, dateFilter]);

  const fetchCurrentStatus = async () => {
    try {
      const response = await attendanceAPI.getCurrentStatus();
      setCurrentStatus(response.data);
    } catch (error) {
      console.error('Error fetching current status:', error);
      alert('Failed to fetch current status');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceLogs = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 200,
        ...(dateFilter.from_date && { from_date: dateFilter.from_date }),
        ...(dateFilter.to_date && { to_date: dateFilter.to_date })
      };
      const response = await attendanceAPI.getAll(params);
      setAttendanceLogs(response.data);
    } catch (error) {
      console.error('Error fetching attendance logs:', error);
      alert('Failed to fetch attendance logs');
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilterChange = (e) => {
    setDateFilter({
      ...dateFilter,
      [e.target.name]: e.target.value
    });
  };

  const clearDateFilter = () => {
    setDateFilter({ from_date: '', to_date: '' });
  };

  const filteredStatus = currentStatus.filter(student =>
    student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.room_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLogs = attendanceLogs.filter(log =>
    log.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.student_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const presentCount = currentStatus.filter(s => s.is_present).length;
  const outsideCount = currentStatus.length - presentCount;

  if (loading && activeTab === 'current') {
    return (
      <Layout title="Attendance Management">
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Attendance Management">
      <div className="attendance-page">
        <div className="stats-row">
          <div className="stat-card present">
            <h3>Present</h3>
            <p className="stat-number">{presentCount}</p>
          </div>
          <div className="stat-card outside">
            <h3>Outside</h3>
            <p className="stat-number">{outsideCount}</p>
          </div>
          <div className="stat-card total">
            <h3>Total Students</h3>
            <p className="stat-number">{currentStatus.length}</p>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'current' ? 'active' : ''}`}
            onClick={() => setActiveTab('current')}
          >
            Current Status
          </button>
          <button
            className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            Attendance Logs
          </button>
        </div>

        <div className="filters-row">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name, student ID, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {activeTab === 'logs' && (
            <div className="date-filters">
              <input
                type="date"
                name="from_date"
                value={dateFilter.from_date}
                onChange={handleDateFilterChange}
                placeholder="From Date"
              />
              <input
                type="date"
                name="to_date"
                value={dateFilter.to_date}
                onChange={handleDateFilterChange}
                placeholder="To Date"
              />
              {(dateFilter.from_date || dateFilter.to_date) && (
                <button className="btn-clear" onClick={clearDateFilter}>
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {activeTab === 'current' && (
          <div className="table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>College Leave</th>
                </tr>
              </thead>
              <tbody>
                {filteredStatus.map((student) => (
                  <tr key={student.id}>
                    <td>{student.student_id}</td>
                    <td>{student.first_name} {student.last_name}</td>
                    <td>{student.room_number || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${student.is_present ? 'present' : 'absent'}`}>
                        {student.display_status}
                      </span>
                    </td>
                    <td>
                      {student.last_updated
                        ? new Date(student.last_updated).toLocaleString()
                        : 'No logs yet'}
                    </td>
                    <td>
                      {student.college_leave_status === 'inside_hostel' ? (
                        <span className="leave-badge" title={student.college_leave_reason}>
                          Inside (College Leave)
                        </span>
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

        {activeTab === 'logs' && (
          <div className="table-container">
            {loading ? (
              <div className="loading">Loading logs...</div>
            ) : (
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Room</th>
                    <th>Log Type</th>
                    <th>RFID Tag</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                      <td>{log.student_number}</td>
                      <td>{log.first_name} {log.last_name}</td>
                      <td>{log.room_number || 'N/A'}</td>
                      <td>
                        <span className={`log-type ${log.log_type}`}>
                          {log.log_type === 'entry' ? '🔓 Entry' : '🔒 Exit'}
                        </span>
                      </td>
                      <td>{log.rfid_tag}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AttendancePage;
