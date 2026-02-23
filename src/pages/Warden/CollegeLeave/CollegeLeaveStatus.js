import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout/Layout';
import { collegeLeaveAPI } from '../../../services/api';
import './CollegeLeaveStatus.css';

const CollegeLeaveStatus = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRecords();
  }, [date]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await collegeLeaveAPI.getAll({ date });
      setRecords(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to fetch college leave records');
    } finally {
      setLoading(false);
    }
  };

  const filtered = records.filter((record) => {
    const keyword = search.toLowerCase();
    return (
      record.first_name.toLowerCase().includes(keyword) ||
      record.last_name.toLowerCase().includes(keyword) ||
      record.student_number.toLowerCase().includes(keyword) ||
      (record.room_number || '').toLowerCase().includes(keyword)
    );
  });

  return (
    <Layout title="College Leave Status">
      <div className="college-leave-page">
        <div className="toolbar">
          <input
            type="text"
            placeholder="Search by student name, ID or room"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <button className="btn-secondary" onClick={fetchRecords}>Refresh</button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="no-data">No college leave records found for selected date</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((record) => (
                  <tr key={record.id}>
                    <td>{record.student_number}</td>
                    <td>{record.first_name} {record.last_name}</td>
                    <td>{record.room_number || 'N/A'}</td>
                    <td>
                      <span className="status-badge">
                        {record.status === 'inside_hostel' ? 'Inside Hostel' : 'At College'}
                      </span>
                    </td>
                    <td>{record.reason}</td>
                    <td>{new Date(record.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CollegeLeaveStatus;
