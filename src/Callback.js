import React, { useEffect, useState } from 'react';
import SalesforceService from './SalesforceService';
import './Callback.css';

function Callback() {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get authorization code from URL
        const params = new URL(window.location.href).searchParams;
        const code = params.get('code');
        const errorParam = params.get('error');
        const errorDescription = params.get('error_description');

        if (errorParam) {
          setError(errorDescription || `OAuth error: ${errorParam}`);
          setStatus('error');
          return;
        }

        if (!code) {
          setError('No authorization code received from Salesforce');
          setStatus('error');
          return;
        }

        // Exchange code for access token
        await SalesforceService.getAccessToken(code);

        setStatus('success');

        // Redirect to home page after 2 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } catch (err) {
        console.error('Callback error:', err);
        setError(err.message || 'Failed to complete OAuth authorization');
        setStatus('error');
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="callback-container">
      {status === 'processing' && (
        <div className="callback-content">
          <div className="spinner-large"></div>
          <h1>Completing Authorization</h1>
          <p>Please wait while we complete your Salesforce authorization...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="callback-content success">
          <div className="success-icon">✓</div>
          <h1>Authorization Successful!</h1>
          <p>Your authorization was successful. Redirecting to the application...</p>
          <p className="secondary">If you are not redirected automatically, <a href="/">click here</a>.</p>
        </div>
      )}

      {status === 'error' && (
        <div className="callback-content error">
          <div className="error-icon">✕</div>
          <h1>Authorization Failed</h1>
          <p>{error}</p>
          <div className="error-details">
            <p>Please check the following:</p>
            <ul>
              <li>Your Connected App credentials are correct</li>
              <li>Your redirect URI matches the application URL</li>
              <li>Your Salesforce org is active and accessible</li>
            </ul>
          </div>
          <a href="/" className="back-button">← Go Back to Login</a>
        </div>
      )}
    </div>
  );
}

export default Callback;
