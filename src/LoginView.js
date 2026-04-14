import React, { useState } from "react";
import SalesforceService from "./SalesforceService";
import "./Login.css";

function LoginView() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const loginUrl = await SalesforceService.getLoginUrl();
      window.location.href = loginUrl;
    } catch (loginError) {
      console.error("Login error:", loginError);
      setError(loginError.message || "Failed to generate the Salesforce login URL.");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Salesforce Validation Rules Manager</h1>
          <p>Manage Account validation rules with a secure Salesforce login.</p>
        </div>

        <div className="login-content">
          <div className="logo-section">
            <img
              src="https://www.salesforce.com/content/dam/web/en_us/www/images/icons/salesforce-logo.svg"
              alt="Salesforce Logo"
              className="salesforce-logo"
              onError={(event) => {
                event.target.style.display = "none";
              }}
            />
            <div className="logo-placeholder">Salesforce</div>
          </div>

          <div className="login-description">
            <h2>Welcome</h2>
            <p>
              This application lets you review Salesforce Account validation
              rules and update their active status from one place.
            </p>
            <ul>
              <li>View Account validation rules</li>
              <li>Enable or disable individual rules</li>
              <li>Apply updates in bulk</li>
              <li>Authenticate with OAuth 2.0 PKCE</li>
            </ul>
          </div>

          <button
            className="login-button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Connecting..." : "Login with Salesforce"}
          </button>

          {error && <div className="error-message">{error}</div>}

          <div className="login-footer">
            <p>Need a Salesforce Developer Org?</p>
            <a
              href="https://developer.salesforce.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="signup-link"
            >
              Sign up for free ->
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginView;
