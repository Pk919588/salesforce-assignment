import React, { useEffect, useState } from "react";
import SalesforceService from "./SalesforceService";
import "./Callback.css";

function CallbackView() {
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URL(window.location.href).searchParams;
        const code = params.get("code");
        const errorParam = params.get("error");
        const errorDescription = params.get("error_description");

        if (errorParam) {
          setError(errorDescription || `OAuth error: ${errorParam}`);
          setStatus("error");
          return;
        }

        if (!code) {
          setError("No authorization code was received from Salesforce.");
          setStatus("error");
          return;
        }

        await SalesforceService.getAccessToken(code);
        setStatus("success");

        window.setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } catch (callbackError) {
        console.error("Callback error:", callbackError);
        setError(
          callbackError.message || "Failed to complete OAuth authorization."
        );
        setStatus("error");
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="callback-container">
      {status === "processing" && (
        <div className="callback-content">
          <div className="spinner-large"></div>
          <h1>Completing Authorization</h1>
          <p>Please wait while Salesforce authorization is being completed.</p>
        </div>
      )}

      {status === "success" && (
        <div className="callback-content success">
          <div className="success-icon">OK</div>
          <h1>Authorization Successful</h1>
          <p>Your Salesforce login succeeded. Redirecting to the application...</p>
          <p className="secondary">
            If you are not redirected automatically, <a href="/">click here</a>.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="callback-content error">
          <div className="error-icon">!</div>
          <h1>Authorization Failed</h1>
          <p>{error}</p>
          <div className="error-details">
            <p>Please verify:</p>
            <ul>
              <li>Your Connected App client ID is correct</li>
              <li>The callback URL matches `http://localhost:3000/callback`</li>
              <li>Your Salesforce org is accessible</li>
            </ul>
          </div>
          <a href="/" className="back-button">
            Back to Login
          </a>
        </div>
      )}
    </div>
  );
}

export default CallbackView;
