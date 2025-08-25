import React, { useState } from 'react';
import '../styles/UserDashboard.css';

const UserDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('services');

  const userServices = [
    { name: 'ENTERTAINMENT', icon: '🎬', active: true },
    { name: 'NEWS', icon: '📰', active: true },
    { name: 'NEWS', icon: '📰', active: true },
    { name: 'LIVE SPORTS', icon: '⚽', active: false },
    { name: 'ASTROLOGY', icon: '🔮', active: false }
  ];

  return (
    <div className="user-dashboard">
      <header className="user-header">
        <div className="header-content">
          <h1>SMART VAS</h1>
          <div className="user-actions">
            <span>Hi {user?.name || 'User'}</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="user-content">
        <div className="welcome-section">
          <h2>Welcome to Your VAS Portal</h2>
          <p>Manage your value-added services with ease</p>
        </div>

        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Your VAS Services
          </button>
          <button
            className={`tab ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            VAS Catalog
          </button>
          <button
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics Dashboard
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'services' && (
            <div className="services-grid">
              {userServices.map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-icon">{service.icon}</div>
                  <h3>{service.name}</h3>
                  <div className={`status ${service.active ? 'active' : 'inactive'}`}>
                    {service.active ? 'Active' : 'Inactive'}
                  </div>
                  <button className="manage-btn">
                    {service.active ? 'Manage' : 'Activate'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'catalog' && (
            <div className="catalog-grid">
              {['ENTERTAINMENT', 'SPORTS', 'ASTROLOGY', 'NEWS', 'GAMES'].map((service, index) => (
                <div key={index} className="catalog-item">
                  <div className="catalog-icon">{service === 'ENTERTAINMENT' ? '🎬' :
                    service === 'SPORTS' ? '⚽' :
                    service === 'ASTROLOGY' ? '🔮' :
                    service === 'NEWS' ? '📰' : '🎮'}</div>
                  <h3>{service}</h3>
                  <p>Explore our {service.toLowerCase()} services</p>
                  <button className="subscribe-btn">Subscribe</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-content">
              <h3>Analytics Dashboard</h3>
              <div className="analytics-cards">
                <div className="analytics-card">
                  <h4>Service Usage</h4>
                  <div className="chart-placeholder">📊 Chart will be displayed here</div>
                </div>
                <div className="analytics-card">
                  <h4>Most Used Services</h4>
                  <ul className="service-list">
                    <li>News (45%)</li>
                    <li>Entertainment (30%)</li>
                    <li>Sports (15%)</li>
                    <li>Astrology (10%)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;