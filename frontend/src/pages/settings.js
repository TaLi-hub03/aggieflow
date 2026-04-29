import React, { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import '../styles/settings.css';

export default function Settings() {
  const {
    settings,
    toggleDarkMode,
    updateEventReminder,
    toggleEventReminders,
    toggleTaskNotifications,
    toggleEmailNotifications,
  } = useSettings();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  function handleChangePassword(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage('Password must be at least 6 characters');
      return;
    }
    // In a real app, send to backend
    setPasswordMessage('Password changed successfully (demo)');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordMessage('');
    }, 1500);
  }

  function handleDeleteAccount() {
    if (deleteConfirm !== 'DELETE') {
      alert('Please type "DELETE" to confirm');
      return;
    }
    // In a real app, send to backend
    alert('Account deleted (demo). Redirecting...');
    setShowDeleteModal(false);
  }

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      {/* Theme Section */}
      <div className="settings-section">
        <h2>Appearance</h2>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-label-group">
              <label className="setting-label">Dark Mode</label>
              <p className="setting-description">Use dark theme for easier viewing in low-light environments</p>
            </div>
            <div className="setting-control">
              <button
                className={`toggle-btn ${settings.darkMode ? 'active' : ''}`}
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
              >
                <span className="toggle-switch"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="settings-section">
        <h2>Notifications & Reminders</h2>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-label-group">
              <label className="setting-label">Event Reminders</label>
              <p className="setting-description">Receive reminders before events</p>
            </div>
            <div className="setting-control">
              <button
                className={`toggle-btn ${settings.eventRemindersEnabled ? 'active' : ''}`}
                onClick={toggleEventReminders}
              >
                <span className="toggle-switch"></span>
              </button>
            </div>
          </div>

          {settings.eventRemindersEnabled && (
            <div className="setting-item indent">
              <div className="setting-label-group">
                <label className="setting-label">Reminder Time</label>
                <p className="setting-description">How long before an event should you be reminded?</p>
              </div>
              <div className="setting-control">
                <select
                  value={settings.eventReminderMinutes}
                  onChange={(e) => updateEventReminder(Number(e.target.value))}
                  className="settings-select"
                >
                  <option value={5}>5 minutes before</option>
                  <option value={15}>15 minutes before</option>
                  <option value={30}>30 minutes before</option>
                  <option value={60}>1 hour before</option>
                  <option value={1440}>1 day before</option>
                </select>
              </div>
            </div>
          )}

          <div className="setting-item">
            <div className="setting-label-group">
              <label className="setting-label">Task Notifications</label>
              <p className="setting-description">Get notified when tasks are assigned or updated</p>
            </div>
            <div className="setting-control">
              <button
                className={`toggle-btn ${settings.taskNotificationsEnabled ? 'active' : ''}`}
                onClick={toggleTaskNotifications}
              >
                <span className="toggle-switch"></span>
              </button>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-label-group">
              <label className="setting-label">Email Notifications</label>
              <p className="setting-description">Receive email summaries of your activities</p>
            </div>
            <div className="setting-control">
              <button
                className={`toggle-btn ${settings.emailNotificationsEnabled ? 'active' : ''}`}
                onClick={toggleEmailNotifications}
              >
                <span className="toggle-switch"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account & Privacy Section */}
      <div className="settings-section">
        <h2>Account & Privacy</h2>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-label-group">
              <label className="setting-label">User ID</label>
              <p className="setting-description">Your unique identifier in the system</p>
            </div>
            <div className="setting-control">
              <input
                type="text"
                value="user_12345"
                disabled
                className="settings-input-disabled"
              />
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-label-group">
              <label className="setting-label">Email Address</label>
              <p className="setting-description">Primary email for your account</p>
            </div>
            <div className="setting-control">
              <input
                type="email"
                value="user@example.com"
                disabled
                className="settings-input-disabled"
              />
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-label-group">
              <label className="setting-label">Password</label>
              <p className="setting-description">Update your password to keep your account secure</p>
            </div>
            <div className="setting-control">
              <button
                className="btn-secondary"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </button>
            </div>
          </div>

          <div className="setting-item danger">
            <div className="setting-label-group">
              <label className="setting-label">Delete Account</label>
              <p className="setting-description">Permanently delete your account and all associated data</p>
            </div>
            <div className="setting-control">
              <button
                className="btn-danger"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Change Password</h3>
            <form onSubmit={handleChangePassword} className="settings-form">
              <label>
                Current Password
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </label>

              <label>
                New Password
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </label>

              <label>
                Confirm Password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </label>

              {passwordMessage && (
                <div className={`message ${passwordMessage.includes('successfully') ? 'success' : 'error'}`}>
                  {passwordMessage}
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal danger-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Account?</h3>
            <p className="warning-text">This action cannot be undone. All your data will be permanently deleted.</p>
            <div className="delete-form">
              <label>
                Type <strong>DELETE</strong> to confirm:
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="Type DELETE here"
                />
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="btn danger"
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE'}
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
