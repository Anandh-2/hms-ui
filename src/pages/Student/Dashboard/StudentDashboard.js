import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import { studentsAPI, attendanceAPI, holidayLeaveAPI } from '../../../services/api';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, statusRes, applicationsRes] = await Promise.all([
        studentsAPI.getMyProfile(),
        attendanceAPI.getMyStatus(),
        holidayLeaveAPI.getMyApplications(),
      ]);

      setProfile(profileRes.data);
      setStatus(statusRes.data);
      setApplications(applicationsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Student Dashboard">
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  const pendingApplications = applications.filter(app => app.status === 'pending').length;
  const approvedApplications = applications.filter(app => app.status === 'approved').length;

  return (
    <Layout title="Student Dashboard">
      <div className="student-dashboard">
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon profile-icon">👤</div>
            <div className="card-content">
              <h3>Student ID</h3>
              <p className="card-text">{profile?.student_id}</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon room-icon">🏠</div>
            <div className="card-content">
              <h3>Room Number</h3>
              <p className="card-text">{profile?.room_number || 'Not Assigned'}</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className={`card-icon ${status?.is_present ? 'present-icon' : 'absent-icon'}`}>
              {status?.is_present ? '✅' : '❌'}
            </div>
            <div className="card-content">
              <h3>Current Status</h3>
              <p className="card-text">{status?.is_present ? 'Present' : 'Outside'}</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon applications-icon">📝</div>
            <div className="card-content">
              <h3>Leave Applications</h3>
              <p className="card-text">{pendingApplications} Pending, {approvedApplications} Approved</p>
            </div>
          </div>
        </div>

        <div className="dashboard-info">
          <div className="info-card">
            <h2>Quick Actions</h2>
            <ul className="quick-actions">
              <li>
                <a href="/student/profile">View My Profile</a>
              </li>
              <li>
                <a href="/student/attendance">View My Attendance</a>
              </li>
              <li>
                <a href="/student/college-leave">Mark College Leave</a>
              </li>
              <li>
                <a href="/student/leave-applications">Apply for Holiday Leave</a>
              </li>
            </ul>
          </div>

          <div className="info-card">
            <h2>Welcome, {profile?.first_name}!</h2>
            <p>From this dashboard, you can:</p>
            <ul>
              <li>View your attendance records</li>
              <li>Mark yourself as inside hostel on college days</li>
              <li>Apply for holiday leave passes</li>
              <li>View your personal details</li>
            </ul>
            {status?.college_leave && (
              <div className="college-leave-notice">
                <strong>College Leave Status:</strong> {status.college_leave.status}
                <br />
                <small>Reason: {status.college_leave.reason}</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
