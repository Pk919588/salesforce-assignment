import React, { useState } from 'react';
import SalesforceService from './SalesforceService';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Redirect to Salesforce OAuth login
      const loginUrl = await SalesforceService.getLoginUrl();
      window.location.href = loginUrl;
    } catch (error) {
      setError('Failed to generate login URL. Please try again.');
      setLoading(false);
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Salesforce Validation Rules Manager</h1>
          <p>Manage Account Validation Rules</p>
        </div>

        <div className="login-content">
          <div className="logo-section">
            <img 
              src="https://www.salesforce.com/content/dam/web/en_us/www/images/icons/salesforce-logo.svg" 
              alt="Salesforce Logo"
              className="salesforce-logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="logo-placeholder">Salesforce</div>
          </div>

          <div className="login-description">
            <h2>Welcome</h2>
            <p>This application allows you to manage Salesforce Account validation rules directly from your browser.</p>
            <ul>
              <li>✓ View all Account validation rules</li>
              <li>✓ Enable/disable individual rules</li>
              <li>✓ Deploy changes to your Salesforce org</li>
              <li>✓ Secure OAuth 2.0 authentication</li>
            </ul>
          </div>

          <button
            className="login-button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Login with Salesforce'}
          </button>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="login-footer">
            <p>Don't have a Salesforce Developer Org?</p>
            <a 
              href="https://developer.salesforce.com/signup" 
              target="_blank" 
              rel="noopener noreferrer"
              className="signup-link"
            >
              Sign up for free →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
