import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout/Layout';
import { studentsAPI } from '../../../services/api';
import './StudentProfile.css';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await studentsAPI.getMyProfile();
      setProfile(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="My Profile">
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout title="My Profile">
        <div className="no-data">Profile not found</div>
      </Layout>
    );
  }

  return (
    <Layout title="My Profile">
      <div className="student-profile-page">
        <div className="profile-section">
          <h2>Account Information</h2>
          <div className="grid">
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Student ID:</strong> {profile.student_id}</p>
            <p><strong>Room Number:</strong> {profile.room_number || 'N/A'}</p>
          </div>
        </div>

        <div className="profile-section">
          <h2>Personal Details</h2>
          <div className="grid">
            <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
            <p><strong>Date of Birth:</strong> {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Phone:</strong> {profile.phone_number || 'N/A'}</p>
            <p><strong>Address:</strong> {profile.address || 'N/A'}</p>
          </div>
        </div>

        <div className="profile-section">
          <h2>Emergency / Medical</h2>
          <div className="grid">
            <p><strong>Parent Name:</strong> {profile.parent_name || 'N/A'}</p>
            <p><strong>Parent Phone:</strong> {profile.parent_phone || 'N/A'}</p>
            <p><strong>Emergency Contact:</strong> {profile.emergency_contact || 'N/A'}</p>
            <p><strong>Blood Group:</strong> {profile.blood_group || 'N/A'}</p>
            <p className="full-width"><strong>Medical Conditions:</strong> {profile.medical_conditions || 'N/A'}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentProfile;
