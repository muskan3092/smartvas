import React from 'react';
import '../styles/AdminDashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
  const sampleUsers = [
    { id: 1, username: 'john_doe', services: ['Entertainment', 'News'] },
    { id: 2, username: 'jane_smith', services: ['Sports', 'Astrology'] },
    { id: 3, username: 'mike_wilson', services: ['Entertainment', 'Games'] },
    { id: 4, username: 'sarah_jones', services: ['News', 'Astrology'] }
  ];

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <h1>SMART VAS</h1>
          <div className="admin-actions">
            <span>Hi Admin</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-section">
          <h2>User Management</h2>
          <div className="users-grid">
            {sampleUsers.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-info">
                  <h3>USER ID {user.id}</h3>
                  <p>USERNAME {user.username}</p>
                </div>
                <div className="user-actions">
                  <button className="manage-btn">Manage User</button>
                  <button className="services-btn">Manage Services</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn primary">Manage All Users</button>
            <button className="action-btn secondary">Manage User Services</button>
            <button className="action-btn tertiary">View Analytics</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;