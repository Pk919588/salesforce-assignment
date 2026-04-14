import React, { useCallback, useEffect, useState } from 'react';
import SalesforceService from './SalesforceService';
import './ValidationRules.css';

function ValidationRules({ onLogout }) {
  const [validationRules, setValidationRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [deploying, setDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState(null);
  const [selectedRules, setSelectedRules] = useState(new Set());
  const [updatingRuleId, setUpdatingRuleId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user info
      const user = await SalesforceService.getUserInfo();
      setUserInfo(user);

      // Get validation rules
      const rules = await SalesforceService.getValidationRulesTooling();
      
      if (!rules || rules.length === 0) {
        setError('No validation rules found. Make sure you have validation rules created in Salesforce for the Account object.');
      } else {
        setValidationRules(rules);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      
      let errorMessage = 'Failed to fetch validation rules. Please check your Salesforce credentials and try again.';
      
      if (err.message) {
        if (err.message.includes('Authentication required')) {
          errorMessage = 'Your session has expired. Please log in again.';
          setTimeout(() => onLogout(), 2000);
        } else if (err.message.includes('Permission denied')) {
          errorMessage = 'Your Salesforce profile does not have permission to access Validation Rules. Contact your Salesforce administrator.';
        } else if (err.message.includes('401') || err.message.includes('unauthorized')) {
          errorMessage = 'Your session has expired. Please log in again.';
          setTimeout(() => onLogout(), 2000);
        } else if (err.message.includes('not found')) {
          errorMessage = 'The requested resource was not found. Your Salesforce instance may not support this API version.';
        } else {
          errorMessage = `Error: ${err.message}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  // Fetch validation rules on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleRuleStatus = async (rule) => {
    try {
      setUpdatingRuleId(rule.id);
      const newStatus = !rule.active;
      
      await SalesforceService.updateValidationRuleStatus({
        ...rule,
        active: newStatus,
      });

      // Update local state
      setValidationRules(prevRules =>
        prevRules.map(r =>
          r.id === rule.id ? { ...r, active: newStatus } : r
        )
      );

      setDeployStatus({
        type: 'success',
        message: `Validation rule "${rule.name}" ${newStatus ? 'activated' : 'deactivated'} successfully!`,
      });
      setTimeout(() => setDeployStatus(null), 3000);
    } catch (err) {
      console.error('Error updating validation rule:', err);
      setError(`Failed to update validation rule: ${err.message}`);
    } finally {
      setUpdatingRuleId(null);
    }
  };

  const toggleRuleSelection = (ruleId) => {
    const newSelected = new Set(selectedRules);
    if (newSelected.has(ruleId)) {
      newSelected.delete(ruleId);
    } else {
      newSelected.add(ruleId);
    }
    setSelectedRules(newSelected);
  };

  const toggleAllRules = () => {
    if (selectedRules.size === validationRules.length) {
      setSelectedRules(new Set());
    } else {
      setSelectedRules(new Set(validationRules.map(r => r.id)));
    }
  };

  const toggleSelectedRulesStatus = async (newStatus) => {
    try {
      setDeploying(true);
      
      const rulesToUpdate = validationRules.filter(r => selectedRules.has(r.id));
      
      if (rulesToUpdate.length === 0) {
        return;
      }

      // Update all selected rules
      await SalesforceService.bulkUpdateValidationRules(
        rulesToUpdate.map(rule => ({
          ...rule,
          active: newStatus,
        }))
      );

      // Update local state
      setValidationRules(prevRules =>
        prevRules.map(r =>
          selectedRules.has(r.id) ? { ...r, active: newStatus } : r
        )
      );

      setSelectedRules(new Set());
      setDeployStatus({
        type: 'success',
        message: `${rulesToUpdate.length} validation rule(s) ${newStatus ? 'activated' : 'deactivated'} successfully!`,
      });
      setTimeout(() => setDeployStatus(null), 3000);
    } catch (err) {
      console.error('Error updating validation rules:', err);
      setError(`Failed to update validation rules: ${err.message}`);
    } finally {
      setDeploying(false);
    }
  };

  const handleDeploy = () => {
    setDeployStatus({
      type: 'info',
      message: 'Changes are applied directly through Salesforce APIs. A separate deploy step is not required here.',
    });
    setTimeout(() => setDeployStatus(null), 4000);
  };

  const activeRulesCount = validationRules.filter(r => r.active).length;
  const inactiveRulesCount = validationRules.length - activeRulesCount;

  return (
    <div className="validation-rules-container">
      <div className="navbar">
        <div className="navbar-content">
          <h1>Salesforce Validation Rules Manager</h1>
          <div className="user-info">
            {userInfo && (
              <>
                <span className="user-name">{userInfo.name}</span>
                <button className="logout-button" onClick={onLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="main-content">
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <div className="error-banner-actions">
              <button onClick={() => fetchData()} title="Retry fetching validation rules">
                Retry
              </button>
              <button onClick={() => setError(null)}>×</button>
            </div>
          </div>
        )}

        {deployStatus && (
          <div className={`deploy-status ${deployStatus.type}`}>
            {deployStatus.message}
          </div>
        )}

        <div className="controls-section">
          <div className="stats-cards">
            <div className="stat-card total">
              <div className="stat-number">{validationRules.length}</div>
              <div className="stat-label">Total Rules</div>
            </div>
            <div className="stat-card active">
              <div className="stat-number">{activeRulesCount}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-card inactive">
              <div className="stat-number">{inactiveRulesCount}</div>
              <div className="stat-label">Inactive</div>
            </div>
          </div>

          <div className="action-buttons">
            <button
              className="btn btn-refresh"
              onClick={fetchData}
              disabled={loading}
              title="Refresh validation rules from Salesforce"
            >
              🔄 Refresh
            </button>
            <button
              className="btn btn-select-all"
              onClick={toggleAllRules}
              disabled={validationRules.length === 0}
              title={selectedRules.size === validationRules.length ? 'Deselect all' : 'Select all'}
            >
              {selectedRules.size === validationRules.length ? '☐ Deselect All' : '☑ Select All'}
            </button>
            {selectedRules.size > 0 && (
              <>
                <button
                  className="btn btn-activate"
                  onClick={() => toggleSelectedRulesStatus(true)}
                  disabled={deploying}
                  title="Activate selected rules"
                >
                  ✓ Activate ({selectedRules.size})
                </button>
                <button
                  className="btn btn-deactivate"
                  onClick={() => toggleSelectedRulesStatus(false)}
                  disabled={deploying}
                  title="Deactivate selected rules"
                >
                  ✗ Deactivate ({selectedRules.size})
                </button>
              </>
            )}
            <button
              className="btn btn-deploy"
              onClick={handleDeploy}
              disabled={deploying || validationRules.length === 0}
              title="Deploy all changes to Salesforce"
            >
              🚀 Deploy to Salesforce
            </button>
          </div>
        </div>

        <div className="rules-section">
          <h2>Account Validation Rules</h2>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading validation rules...</p>
              <p className="loading-subtext">Connecting to your Salesforce instance</p>
            </div>
          ) : validationRules.length === 0 ? (
            <div className="empty-state">
              <p>No validation rules found for Account object.</p>
              <a
                href={`${SalesforceService.instanceUrl}/setup/ui/listCustomValidationRules.apexp`}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Create validation rules in Salesforce →
              </a>
            </div>
          ) : (
            <div className="rules-table-container">
              <table className="rules-table">
                <thead>
                  <tr>
                    <th className="checkbox-col">
                      <input
                        type="checkbox"
                        checked={selectedRules.size === validationRules.length && validationRules.length > 0}
                        onChange={toggleAllRules}
                        disabled={validationRules.length === 0}
                      />
                    </th>
                    <th>Rule Name</th>
                    <th>Description</th>
                    <th>Error Message</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {validationRules.map(rule => (
                    <tr key={rule.id} className={selectedRules.has(rule.id) ? 'selected' : ''}>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          checked={selectedRules.has(rule.id)}
                          onChange={() => toggleRuleSelection(rule.id)}
                        />
                      </td>
                      <td className="name-col">
                        <strong>{rule.name}</strong>
                      </td>
                      <td className="description-col">
                        {rule.description || '—'}
                      </td>
                      <td className="error-col">
                        {rule.errorMessage || '—'}
                      </td>
                      <td className="status-col">
                        <span className={`status-badge ${rule.active ? 'active' : 'inactive'}`}>
                          {rule.active ? '✓ Active' : '✗ Inactive'}
                        </span>
                      </td>
                      <td className="actions-col">
                        <button
                          className={`status-button ${rule.active ? 'deactivate' : 'activate'}`}
                          onClick={() => toggleRuleStatus(rule)}
                          disabled={updatingRuleId === rule.id || deploying}
                          title={rule.active ? 'Deactivate this rule' : 'Activate this rule'}
                        >
                          {updatingRuleId === rule.id ? '⏳' : rule.active ? '⊗' : '⊙'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="info-section">
          <h3>About This Application</h3>
          <div className="info-cards">
            <div className="info-card">
              <h4>OAuth 2.0 Authorization</h4>
              <p>This application uses secure OAuth 2.0 authentication to connect with your Salesforce org. Your credentials are never stored directly.</p>
            </div>
            <div className="info-card">
              <h4>Metadata & Tooling APIs</h4>
              <p>Uses Salesforce Tooling API to manage validation rules, allowing real-time updates without requiring deployments.</p>
            </div>
            <div className="info-card">
              <h4>Bulk Operations</h4>
              <p>Select multiple rules and activate/deactivate them in bulk, then deploy all changes to your org at once.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ValidationRules;
