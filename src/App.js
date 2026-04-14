import React, { useEffect, useState } from 'react';
import LoginView from './LoginView';
import ValidationRulesView from './ValidationRulesView';
import CallbackView from './CallbackView';
import SalesforceService from './SalesforceService';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCallback, setIsCallback] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we're in the callback route
    if (window.location.pathname === '/callback' || window.location.search.includes('code=')) {
      setIsCallback(true);
      setLoading(false);
      return;
    }

    // Check if user is already authenticated
    if (SalesforceService.isAuthenticated()) {
      setIsAuthenticated(true);
    } else {
      // Clear any stale pre-fix session data so the user returns to login cleanly.
      SalesforceService.logout();
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    SalesforceService.logout();
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isCallback) {
    return <CallbackView />;
  }

  if (isAuthenticated) {
    return <ValidationRulesView onLogout={handleLogout} />;
  }

  return <LoginView />;
}

export default App;
