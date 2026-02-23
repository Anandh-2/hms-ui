import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import { studentsAPI, wardensAPI, attendanceAPI, holidayLeaveAPI } from '../../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalWardens: 0,
    presentStudents: 0,
    pendingApplications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, wardensRes, statusRes, applicationsRes] = await Promise.all([
        studentsAPI.getAll(),
        wardensAPI.getAll(),
        attendanceAPI.getCurrentStatus(),
        holidayLeaveAPI.getAll({ status: 'pending' }),
      ]);

      const presentCount = statusRes.data.filter(s => s.is_present).length;

      setStats({
        totalStudents: studentsRes.data.length,
        totalWardens: wardensRes.data.length,
        presentStudents: presentCount,
        pendingApplications: applicationsRes.data.length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Admin Dashboard">
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="dashboard">
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon students-icon">👨‍🎓</div>
            <div className="card-content">
              <h3>Total Students</h3>
              <p className="card-number">{stats.totalStudents}</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon wardens-icon">👮</div>
            <div className="card-content">
              <h3>Total Wardens</h3>
              <p className="card-number">{stats.totalWardens}</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon present-icon">✅</div>
            <div className="card-content">
              <h3>Present Today</h3>
              <p className="card-number">{stats.presentStudents}</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon pending-icon">⏳</div>
            <div className="card-content">
              <h3>Pending Applications</h3>
              <p className="card-number">{stats.pendingApplications}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-info">
          <div className="info-card">
            <h2>Quick Actions</h2>
            <ul className="quick-actions">
              <li>
                <a href="/admin/students">Manage Students</a>
              </li>
              <li>
                <a href="/admin/wardens">Manage Wardens</a>
              </li>
              <li>
                <a href="/admin/attendance">View Attendance</a>
              </li>
              <li>
                <a href="/admin/leave-applications">Review Leave Applications</a>
              </li>
              <li>
                <a href="/admin/reminders">Configure Reminders</a>
              </li>
            </ul>
          </div>

          <div className="info-card">
            <h2>System Information</h2>
            <p>Welcome to the Hostel Management System Admin Dashboard.</p>
            <p>From here you can manage all aspects of the hostel including:</p>
            <ul>
              <li>Student and Warden accounts</li>
              <li>Attendance tracking via RFID</li>
              <li>Leave applications</li>
              <li>SMS reminders</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
