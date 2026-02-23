import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout/Layout';
import { remindersAPI } from '../../../services/api';
import './ReminderSettings.css';

const ReminderSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [settings, setSettings] = useState({
    reminder_time: '20:00:00',
    is_active: true,
  });
  const [smsLogs, setSmsLogs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, logsRes] = await Promise.all([
        remindersAPI.getSettings(),
        remindersAPI.getLogs({ limit: 20 }),
      ]);
      setSettings({
        reminder_time: settingsRes.data.reminder_time || '20:00:00',
        is_active: !!settingsRes.data.is_active,
      });
      setSmsLogs(logsRes.data || []);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to fetch reminder settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await remindersAPI.updateSettings(settings);
      alert('Reminder settings updated successfully');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update reminder settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSendTest = async () => {
    setSendingTest(true);
    try {
      await remindersAPI.sendTest();
      alert('Test reminders triggered successfully');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send test reminders');
    } finally {
      setSendingTest(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Reminder Settings">
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Reminder Settings">
      <div className="reminder-settings-page">
        <form className="settings-card" onSubmit={handleSubmit}>
          <h2>Attendance Reminder</h2>
          <div className="form-group">
            <label htmlFor="reminder_time">Reminder Time</label>
            <input
              id="reminder_time"
              type="time"
              value={settings.reminder_time?.slice(0, 5) || '20:00'}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  reminder_time: `${e.target.value}:00`,
                }))
              }
              required
            />
          </div>

          <div className="checkbox-row">
            <input
              id="is_active"
              type="checkbox"
              checked={settings.is_active}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, is_active: e.target.checked }))
              }
            />
            <label htmlFor="is_active">Enable daily reminder SMS</label>
          </div>

          <div className="actions-row">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            <button type="button" className="btn-secondary" onClick={handleSendTest} disabled={sendingTest}>
              {sendingTest ? 'Sending...' : 'Send Test Reminder'}
            </button>
          </div>
        </form>

        <div className="logs-card">
          <h2>Recent SMS Logs</h2>
          {smsLogs.length === 0 ? (
            <p className="no-data">No SMS logs found</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Student</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {smsLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{new Date(log.sent_at).toLocaleString()}</td>
                      <td>{log.first_name} {log.last_name}</td>
                      <td>{log.phone_number}</td>
                      <td>
                        <span className={`status ${log.status}`}>{log.status}</span>
                      </td>
                      <td className="message-cell">{log.message}</td>
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

export default ReminderSettings;
