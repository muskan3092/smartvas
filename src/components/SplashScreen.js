import React, { useEffect } from 'react';
import '../styles/SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="logo-container">
          <div className="logo">SV</div>
        </div>
        <h1 className="splash-title">SmartVAS</h1>
        <p className="splash-message">Your Gateway to Value-Added Services</p>
        <div className="loading-bar">
          <div className="progress"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;