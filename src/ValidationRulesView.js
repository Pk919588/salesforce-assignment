import React, { useCallback, useEffect, useState } from "react";
import SalesforceService from "./SalesforceService";
import "./ValidationRules.css";

function ValidationRulesView({ onLogout }) {
  const [validationRules, setValidationRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [selectedRules, setSelectedRules] = useState(new Set());
  const [updatingRuleId, setUpdatingRuleId] = useState(null);

  const showStatus = useCallback((type, message, timeoutMs = 3000) => {
    setStatusMessage({ type, message });
    window.setTimeout(() => setStatusMessage(null), timeoutMs);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await SalesforceService.getUserInfo();
      setUserInfo(user);

      const rules = await SalesforceService.getValidationRulesTooling();

      if (!rules || rules.length === 0) {
        setValidationRules([]);
        setError(
          "No validation rules found. Make sure the Account object has validation rules in Salesforce."
        );
        return;
      }

      setValidationRules(rules);
    } catch (fetchError) {
      console.error("Error fetching data:", fetchError);

      let errorMessage =
        "Failed to fetch validation rules. Please check your Salesforce credentials and try again.";

      if (fetchError.message) {
        const lowerMessage = fetchError.message.toLowerCase();

        if (
          fetchError.message.includes("Authentication required") ||
          fetchError.message.includes("401") ||
          lowerMessage.includes("unauthorized") ||
          lowerMessage.includes("invalid session")
        ) {
          errorMessage = "Your session has expired. Please log in again.";
          window.setTimeout(() => onLogout(), 2000);
        } else if (fetchError.message.includes("Permission denied")) {
          errorMessage =
            "Your Salesforce profile does not have permission to access validation rules.";
        } else if (lowerMessage.includes("not found")) {
          errorMessage =
            "The requested Salesforce resource was not found. Check your API version and org access.";
        } else {
          errorMessage = `Error: ${fetchError.message}`;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleRuleStatus = async (rule) => {
    try {
      setUpdatingRuleId(rule.id);
      setError(null);

      const newStatus = !rule.active;

      await SalesforceService.updateValidationRuleStatus({
        ...rule,
        active: newStatus,
      });

      setValidationRules((prevRules) =>
        prevRules.map((currentRule) =>
          currentRule.id === rule.id
            ? { ...currentRule, active: newStatus }
            : currentRule
        )
      );

      showStatus(
        "success",
        `Validation rule "${rule.name}" ${newStatus ? "activated" : "deactivated"} successfully.`
      );
    } catch (updateError) {
      console.error("Error updating validation rule:", updateError);
      setError(`Failed to update validation rule: ${updateError.message}`);
    } finally {
      setUpdatingRuleId(null);
    }
  };

  const toggleRuleSelection = (ruleId) => {
    const nextSelected = new Set(selectedRules);

    if (nextSelected.has(ruleId)) {
      nextSelected.delete(ruleId);
    } else {
      nextSelected.add(ruleId);
    }

    setSelectedRules(nextSelected);
  };

  const toggleAllRules = () => {
    if (selectedRules.size === validationRules.length) {
      setSelectedRules(new Set());
      return;
    }

    setSelectedRules(new Set(validationRules.map((rule) => rule.id)));
  };

  const toggleSelectedRulesStatus = async (newStatus) => {
    try {
      const rulesToUpdate = validationRules.filter((rule) =>
        selectedRules.has(rule.id)
      );

      if (rulesToUpdate.length === 0) {
        return;
      }

      setUpdating(true);
      setError(null);

      await SalesforceService.bulkUpdateValidationRules(
        rulesToUpdate.map((rule) => ({
          ...rule,
          active: newStatus,
        }))
      );

      setValidationRules((prevRules) =>
        prevRules.map((rule) =>
          selectedRules.has(rule.id) ? { ...rule, active: newStatus } : rule
        )
      );

      setSelectedRules(new Set());
      showStatus(
        "success",
        `${rulesToUpdate.length} validation rule(s) ${newStatus ? "activated" : "deactivated"} successfully.`
      );
    } catch (updateError) {
      console.error("Error updating validation rules:", updateError);
      setError(`Failed to update validation rules: ${updateError.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const activeRulesCount = validationRules.filter((rule) => rule.active).length;
  const inactiveRulesCount = validationRules.length - activeRulesCount;
  const displayName =
    userInfo?.display_name || userInfo?.name || userInfo?.preferred_username;

  return (
    <div className="validation-rules-container">
      <div className="navbar">
        <div className="navbar-content">
          <h1>Salesforce Validation Rules Manager</h1>
          <div className="user-info">
            {displayName && <span className="user-name">{displayName}</span>}
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="main-content">
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <div className="error-banner-actions">
              <button
                onClick={() => fetchData()}
                title="Retry fetching validation rules"
              >
                Retry
              </button>
              <button onClick={() => setError(null)}>x</button>
            </div>
          </div>
        )}

        {statusMessage && (
          <div className={`deploy-status ${statusMessage.type}`}>
            {statusMessage.message}
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
              Refresh
            </button>
            <button
              className="btn btn-select-all"
              onClick={toggleAllRules}
              disabled={validationRules.length === 0}
              title={
                selectedRules.size === validationRules.length
                  ? "Deselect all"
                  : "Select all"
              }
            >
              {selectedRules.size === validationRules.length
                ? "Deselect All"
                : "Select All"}
            </button>
            {selectedRules.size > 0 && (
              <>
                <button
                  className="btn btn-activate"
                  onClick={() => toggleSelectedRulesStatus(true)}
                  disabled={updating}
                  title="Activate selected rules"
                >
                  Activate ({selectedRules.size})
                </button>
                <button
                  className="btn btn-deactivate"
                  onClick={() => toggleSelectedRulesStatus(false)}
                  disabled={updating}
                  title="Deactivate selected rules"
                >
                  Deactivate ({selectedRules.size})
                </button>
              </>
            )}
          </div>
        </div>

        <div className="rules-section">
          <h2>Account Validation Rules</h2>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading validation rules...</p>
              <p className="loading-subtext">
                Connecting to your Salesforce instance
              </p>
            </div>
          ) : validationRules.length === 0 ? (
            <div className="empty-state">
              <p>No validation rules found for the Account object.</p>
              <a
                href={`${SalesforceService.instanceUrl}/setup/ui/listCustomValidationRules.apexp`}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Create validation rules in Salesforce -&gt;
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
                        checked={
                          selectedRules.size === validationRules.length &&
                          validationRules.length > 0
                        }
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
                  {validationRules.map((rule) => (
                    <tr
                      key={rule.id}
                      className={selectedRules.has(rule.id) ? "selected" : ""}
                    >
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
                        {rule.description || "-"}
                      </td>
                      <td className="error-col">{rule.errorMessage || "-"}</td>
                      <td className="status-col">
                        <span
                          className={`status-badge ${
                            rule.active ? "active" : "inactive"
                          }`}
                        >
                          {rule.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="actions-col">
                        <button
                          className={`status-button ${
                            rule.active ? "deactivate" : "activate"
                          }`}
                          onClick={() => toggleRuleStatus(rule)}
                          disabled={updatingRuleId === rule.id || updating}
                          title={
                            rule.active
                              ? "Deactivate this rule"
                              : "Activate this rule"
                          }
                        >
                          {updatingRuleId === rule.id
                            ? "..."
                            : rule.active
                              ? "Disable"
                              : "Enable"}
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
              <p>
                This application uses secure OAuth 2.0 authentication to connect
                with your Salesforce org. Your credentials are never stored
                directly.
              </p>
            </div>
            <div className="info-card">
              <h4>Metadata &amp; Tooling APIs</h4>
              <p>
                Uses Salesforce Tooling API to read validation rules and update
                their active status where the org permissions allow it.
              </p>
            </div>
            <div className="info-card">
              <h4>Bulk Operations</h4>
              <p>
                Select multiple rules and activate or deactivate them in one
                action from the same screen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ValidationRulesView;
