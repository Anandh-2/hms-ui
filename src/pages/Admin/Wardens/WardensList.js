import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import { wardensAPI } from '../../../services/api';
import './WardensList.css';

const WardensList = () => {
  const [wardens, setWardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWarden, setEditingWarden] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: ''
  });

  useEffect(() => {
    fetchWardens();
  }, []);

  const fetchWardens = async () => {
    try {
      const response = await wardensAPI.getAll();
      setWardens(response.data);
    } catch (error) {
      console.error('Error fetching wardens:', error);
      alert('Failed to fetch wardens');
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
      if (editingWarden) {
        await wardensAPI.update(editingWarden.id, formData);
        alert('Warden updated successfully');
      } else {
        await wardensAPI.create(formData);
        alert('Warden created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchWardens();
    } catch (error) {
      console.error('Error saving warden:', error);
      alert(error.response?.data?.message || 'Failed to save warden');
    }
  };

  const handleEdit = (warden) => {
    setEditingWarden(warden);
    setFormData({
      username: warden.username,
      email: warden.email,
      password: '',
      first_name: warden.first_name,
      last_name: warden.last_name,
      phone_number: warden.phone_number || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (warden) => {
    if (window.confirm(`Are you sure you want to delete ${warden.first_name} ${warden.last_name}?`)) {
      try {
        await wardensAPI.delete(warden.id);
        alert('Warden deleted successfully');
        fetchWardens();
      } catch (error) {
        console.error('Error deleting warden:', error);
        alert('Failed to delete warden');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      phone_number: ''
    });
    setEditingWarden(null);
  };

  if (loading) {
    return (
      <Layout title="Manage Wardens">
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Manage Wardens">
      <div className="wardens-list">
        <div className="page-header">
          <h2>Total Wardens: {wardens.length}</h2>
          <button
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Add Warden
          </button>
        </div>

        <div className="table-container">
          <table className="wardens-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {wardens.map((warden) => (
                <tr key={warden.id}>
                  <td>{warden.first_name} {warden.last_name}</td>
                  <td>{warden.username}</td>
                  <td>{warden.email}</td>
                  <td>{warden.phone_number || 'N/A'}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(warden)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(warden)}>
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
                <h2>{editingWarden ? 'Edit Warden' : 'Add New Warden'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="warden-form">
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
                        disabled={editingWarden}
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

                  <div className="form-group">
                    <label>Password {!editingWarden && '*'}</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!editingWarden}
                      placeholder={editingWarden ? 'Leave blank to keep current' : ''}
                    />
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

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingWarden ? 'Update Warden' : 'Create Warden'}
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

export default WardensList;
