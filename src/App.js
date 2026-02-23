import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Common
import Login from './pages/Login/Login';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import StudentsList from './pages/Admin/Students/StudentsList';
import AttendancePage from './pages/Admin/Attendance/AttendancePage';
import WardensList from './pages/Admin/Wardens/WardensList';
import LeaveApplications from './pages/Admin/LeaveApplications/LeaveApplications';
// Note: ReminderSettings - Create using PAGES_IMPLEMENTATION_GUIDE.md
// import ReminderSettings from './pages/Admin/Reminders/ReminderSettings';

// Warden Pages (many reuse Admin components)
import WardenDashboard from './pages/Warden/Dashboard/WardenDashboard';
// Warden uses same components: StudentsList, AttendancePage, LeaveApplications
// Note: CollegeLeaveStatus - Create using PAGES_IMPLEMENTATION_GUIDE.md
// import CollegeLeaveStatus from './pages/Warden/CollegeLeave/CollegeLeaveStatus';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard/StudentDashboard';
// Note: Create these files using PAGES_IMPLEMENTATION_GUIDE.md (templates provided)
// import StudentProfile from './pages/Student/Profile/StudentProfile';
// import StudentAttendance from './pages/Student/Attendance/StudentAttendance';
// import CollegeLeave from './pages/Student/CollegeLeave/CollegeLeave';
// import StudentLeaveApplications from './pages/Student/LeaveApplications/LeaveApplications';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/admin/students" element={
            <PrivateRoute allowedRoles={['admin']}>
              <StudentsList />
            </PrivateRoute>
          } />
          
          <Route path="/admin/wardens" element={
            <PrivateRoute allowedRoles={['admin']}>
              <WardensList />
            </PrivateRoute>
          } />
          
          <Route path="/admin/attendance" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AttendancePage />
            </PrivateRoute>
          } />
          
          <Route path="/admin/leave-applications" element={
            <PrivateRoute allowedRoles={['admin']}>
              <LeaveApplications />
            </PrivateRoute>
          } />
          
          {/* Uncomment after creating ReminderSettings component
          <Route path="/admin/reminders" element={
            <PrivateRoute allowedRoles={['admin']}>
              <ReminderSettings />
            </PrivateRoute>
          } />
          */}
          
          {/* Warden Routes - Many reuse Admin components */}
          <Route path="/warden/dashboard" element={
            <PrivateRoute allowedRoles={['warden']}>
              <WardenDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/warden/students" element={
            <PrivateRoute allowedRoles={['warden']}>
              <StudentsList />
            </PrivateRoute>
          } />
          
          <Route path="/warden/attendance" element={
            <PrivateRoute allowedRoles={['warden']}>
              <AttendancePage />
            </PrivateRoute>
          } />
          
          <Route path="/warden/leave-applications" element={
            <PrivateRoute allowedRoles={['warden']}>
              <LeaveApplications />
            </PrivateRoute>
          } />
          
          {/* Uncomment after creating these components
          <Route path="/warden/college-leave" element={
            <PrivateRoute allowedRoles={['warden']}>
              <CollegeLeaveStatus />
            </PrivateRoute>
          } />
          
          <Route path="/warden/reminders" element={
            <PrivateRoute allowedRoles={['warden']}>
              <ReminderSettings />
            </PrivateRoute>
          } />
          */}
          
          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentDashboard />
            </PrivateRoute>
          } />
          
          {/* Uncomment after creating these components
          <Route path="/student/profile" element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentProfile />
            </PrivateRoute>
          } />
          
          <Route path="/student/attendance" element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentAttendance />
            </PrivateRoute>
          } />
          
          <Route path="/student/college-leave" element={
            <PrivateRoute allowedRoles={['student']}>
              <CollegeLeave />
            </PrivateRoute>
          } />
          
          <Route path="/student/leave-applications" element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentLeaveApplications />
            </PrivateRoute>
          } />
          */}
          
          {/* Error Routes */}
          <Route path="/unauthorized" element={
            <div className="unauthorized-page">
              <h1>Unauthorized Access</h1>
              <p>You don't have permission to access this page.</p>
              <a href="/login">Go to Login</a>
            </div>
          } />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
