import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import { studentsAPI } from '../../../services/api';
import './StudentsList.css';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    student_id: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone_number: '',
    emergency_contact: '',
    parent_name: '',
    parent_phone: '',
    address: '',
    room_number: '',
    rfid_tag: '',
    blood_group: '',
    medical_conditions: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentsAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentsAPI.update(editingStudent.id, formData);
        alert('Student updated successfully');
      } else {
        await studentsAPI.create(formData);
        alert('Student created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      alert(error.response?.data?.message || 'Failed to save student');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      username: student.username,
      email: student.email,
      password: '',
      student_id: student.student_id,
      first_name: student.first_name,
      last_name: student.last_name,
      date_of_birth: student.date_of_birth?.split('T')[0] || '',
      phone_number: student.phone_number || '',
      emergency_contact: student.emergency_contact || '',
      parent_name: student.parent_name || '',
      parent_phone: student.parent_phone || '',
      address: student.address || '',
      room_number: student.room_number || '',
      rfid_tag: student.rfid_tag || '',
      blood_group: student.blood_group || '',
      medical_conditions: student.medical_conditions || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.first_name} ${student.last_name}?`)) {
      try {
        await studentsAPI.delete(student.id);
        alert('Student deleted successfully');
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      student_id: '',
      first_name: '',
      last_name: '',
      date_of_birth: '',
      phone_number: '',
      emergency_contact: '',
      parent_name: '',
      parent_phone: '',
      address: '',
      room_number: '',
      rfid_tag: '',
      blood_group: '',
      medical_conditions: ''
    });
    setEditingStudent(null);
  };

  const filteredStudents = students.filter(student =>
    student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.room_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout title="Manage Students">
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Manage Students">
      <div className="students-list">
        <div className="page-header">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name, student ID, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Add Student
          </button>
        </div>

        <div className="table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Room</th>
                <th>Phone</th>
                <th>RFID Tag</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.student_id}</td>
                  <td>{student.first_name} {student.last_name}</td>
                  <td>{student.room_number || 'N/A'}</td>
                  <td>{student.phone_number || 'N/A'}</td>
                  <td>{student.rfid_tag || 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${student.last_log_type === 'entry' ? 'present' : 'absent'}`}>
                      {student.last_log_type === 'entry' ? 'Present' : 'Outside'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(student)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(student)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="student-form">
                <div className="form-section">
                  <h3>Account Details</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Username *</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        disabled={editingStudent}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Password {!editingStudent && '*'}</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={!editingStudent}
                        placeholder={editingStudent ? 'Leave blank to keep current' : ''}
                      />
                    </div>
                    <div className="form-group">
                      <label>Student ID *</label>
                      <input
                        type="text"
                        name="student_id"
                        value={formData.student_id}
                        onChange={handleInputChange}
                        required
                        disabled={editingStudent}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Personal Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Emergency Contact</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Parent Name</label>
                      <input
                        type="text"
                        name="parent_name"
                        value={formData.parent_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Parent Phone</label>
                      <input
                        type="tel"
                        name="parent_phone"
                        value={formData.parent_phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Emergency Contact</label>
                    <input
                      type="tel"
                      name="emergency_contact"
                      value={formData.emergency_contact}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Hostel Details</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Room Number</label>
                      <input
                        type="text"
                        name="room_number"
                        value={formData.room_number}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>RFID Tag</label>
                      <input
                        type="text"
                        name="rfid_tag"
                        value={formData.rfid_tag}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Medical Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Blood Group</label>
                      <select
                        name="blood_group"
                        value={formData.blood_group}
                        onChange={handleInputChange}
                      >
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Medical Conditions</label>
                    <textarea
                      name="medical_conditions"
                      value={formData.medical_conditions}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Any allergies, chronic conditions, etc."
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingStudent ? 'Update Student' : 'Create Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentsList;
