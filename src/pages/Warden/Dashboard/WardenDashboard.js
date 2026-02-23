import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import { studentsAPI, attendanceAPI, holidayLeaveAPI } from '../../../services/api';
import './WardenDashboard.css';

const WardenDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentStudents: 0,
    pendingApplications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, statusRes, applicationsRes] = await Promise.all([
        studentsAPI.getAll(),
        attendanceAPI.getCurrentStatus(),
        holidayLeaveAPI.getAll({ status: 'pending' }),
      ]);

      const presentCount = statusRes.data.filter(s => s.is_present).length;

      setStats({
        totalStudents: studentsRes.data.length,
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
      <Layout title="Warden Dashboard">
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Warden Dashboard">
      <div className="warden-dashboard">
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon students-icon">👨‍🎓</div>
            <div className="card-content">
              <h3>Total Students</h3>
              <p className="card-number">{stats.totalStudents}</p>
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
                <a href="/warden/students">Manage Students</a>
              </li>
              <li>
                <a href="/warden/attendance">View Attendance</a>
              </li>
              <li>
                <a href="/warden/college-leave">View College Leave</a>
              </li>
              <li>
                <a href="/warden/leave-applications">Review Leave Applications</a>
              </li>
              <li>
                <a href="/warden/reminders">Configure Reminders</a>
              </li>
            </ul>
          </div>

          <div className="info-card">
            <h2>Warden Dashboard</h2>
            <p>From this dashboard, you can:</p>
            <ul>
              <li>Create and manage student accounts</li>
              <li>View real-time attendance status</li>
              <li>Monitor college leave requests</li>
              <li>Approve or reject holiday leave applications</li>
              <li>Configure SMS reminder settings</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WardenDashboard;
