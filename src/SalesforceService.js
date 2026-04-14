// /**
//  * Salesforce Service - FINAL CORRECT VERSION
//  */

// const SALESFORCE_CLIENT_ID = process.env.REACT_APP_SALESFORCE_CLIENT_ID;
// const SALESFORCE_REDIRECT_URI = process.env.REACT_APP_SALESFORCE_REDIRECT_URI;
// const SALESFORCE_AUTH_URL =
//   process.env.REACT_APP_SALESFORCE_AUTH_URL || "https://login.salesforce.com";
// const SALESFORCE_TOKEN_PROXY_URL =
//   process.env.REACT_APP_SALESFORCE_TOKEN_PROXY_URL || "/api/salesforce/token";
// const SALESFORCE_API_VERSION =
//   process.env.REACT_APP_SALESFORCE_API_VERSION || "61.0";
// const STORAGE_KEYS = {
//   accessToken: "sfAccessToken",
//   instanceUrl: "sfInstanceUrl",
//   identityUrl: "sfIdentityUrl",
//   refreshToken: "sfRefreshToken",
// };

// class SalesforceService {
//   constructor() {
//     this.accessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
//     this.instanceUrl = localStorage.getItem(STORAGE_KEYS.instanceUrl);
//     this.identityUrl = localStorage.getItem(STORAGE_KEYS.identityUrl);
//     this.refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
//   }

//   // Validate required frontend OAuth configuration before starting the flow.
//   validateOAuthConfig() {
//     const missingFields = [];

//     if (!SALESFORCE_CLIENT_ID) {
//       missingFields.push("REACT_APP_SALESFORCE_CLIENT_ID");
//     }

//     if (!SALESFORCE_REDIRECT_URI) {
//       missingFields.push("REACT_APP_SALESFORCE_REDIRECT_URI");
//     }

//     if (missingFields.length > 0) {
//       throw new Error(
//         `Missing Salesforce environment variables: ${missingFields.join(", ")}`
//       );
//     }
//   }

//   // ================= PKCE LOGIN =================
//   async getLoginUrl() {
//     this.validateOAuthConfig();

//     const array = new Uint8Array(32);
//     crypto.getRandomValues(array);

//     const codeVerifier = btoa(String.fromCharCode(...array))
//       .replace(/\+/g, "-")
//       .replace(/\//g, "_")
//       .replace(/=/g, "");

//     sessionStorage.setItem("sf_code_verifier", codeVerifier);

//     const encoder = new TextEncoder();
//     const data = encoder.encode(codeVerifier);
//     const digest = await crypto.subtle.digest("SHA-256", data);

//     const codeChallenge = btoa(
//       String.fromCharCode(...new Uint8Array(digest))
//     )
//       .replace(/\+/g, "-")
//       .replace(/\//g, "_")
//       .replace(/=/g, "");

//     const params = new URLSearchParams({
//       response_type: "code",
//       client_id: SALESFORCE_CLIENT_ID,
//       redirect_uri: SALESFORCE_REDIRECT_URI,
//       scope: "full refresh_token api",
//       code_challenge: codeChallenge,
//       code_challenge_method: "S256",
//     });

//     return `${SALESFORCE_AUTH_URL}/services/oauth2/authorize?${params.toString()}`;
//   }

//   // ================= TOKEN =================
//   async getAccessToken(code) {
//     this.validateOAuthConfig();

//     const codeVerifier = sessionStorage.getItem("sf_code_verifier");

//     if (!codeVerifier) {
//       throw new Error("Missing PKCE code verifier. Please start the login flow again.");
//     }

//     const response = await fetch(SALESFORCE_TOKEN_PROXY_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         grant_type: "authorization_code",
//         code,
//         client_id: SALESFORCE_CLIENT_ID,
//         redirect_uri: SALESFORCE_REDIRECT_URI,
//         code_verifier: codeVerifier,
//       }),
//     });

//     if (!response.ok) {
//       const message = await this.readErrorResponse(response, "Token failed");
//       throw new Error(message);
//     }

//     const data = await response.json();
//     this.storeSession(data);

//     return data;
//   }

//   // ================= COMMON API =================
//   async makeProxiedRequest(targetUrl, method = "GET", body = null) {
//     const proxyRequest = {
//       targetUrl,
//       method,
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//     };

//     if (body) proxyRequest.body = body;

//     let response = await fetch("/api/salesforce/proxy", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(proxyRequest),
//     });

//     // Check if the response indicates an invalid token
//     if (!response.ok) {
//       const errorText = await response.text();
//       if (errorText.includes("Bad_OAuth_Token") || errorText.includes("INVALID_SESSION_ID")) {
//         // Try to refresh the token
//         if (this.refreshToken) {
//           try {
//             await this.refreshAccessToken();
//             // Retry the request with the new token
//             proxyRequest.headers.Authorization = `Bearer ${this.accessToken}`;
//             response = await fetch("/api/salesforce/proxy", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(proxyRequest),
//             });
//           } catch (refreshError) {
//             // Refresh failed, logout
//             this.logout();
//             throw new Error("Session expired. Please log in again.");
//           }
//         } else {
//           // No refresh token, logout
//           this.logout();
//           throw new Error("Session expired. Please log in again.");
//         }
//       }
//     }

//     return response;
//   }

//   async readErrorResponse(response, fallbackMessage) {
//     try {
//       const contentType = response.headers.get("content-type") || "";

//       if (contentType.includes("application/json")) {
//         const errorBody = await response.json();

//         if (Array.isArray(errorBody) && errorBody.length > 0) {
//           return errorBody
//             .map((item) => item.message || item.errorCode)
//             .filter(Boolean)
//             .join("; ") || fallbackMessage;
//         }

//         return (
//           errorBody.error_description ||
//           errorBody.message ||
//           errorBody.error ||
//           fallbackMessage
//         );
//       }

//       const text = await response.text();
//       return text || fallbackMessage;
//     } catch {
//       return fallbackMessage;
//     }
//   }

//   storeSession(data) {
//     localStorage.setItem(STORAGE_KEYS.accessToken, data.access_token);
//     localStorage.setItem(STORAGE_KEYS.instanceUrl, data.instance_url);
//     localStorage.setItem(STORAGE_KEYS.identityUrl, data.id || this.identityUrl || "");

//     if (data.refresh_token) {
//       localStorage.setItem(STORAGE_KEYS.refreshToken, data.refresh_token);
//       this.refreshToken = data.refresh_token;
//     }

//     this.accessToken = data.access_token;
//     this.instanceUrl = data.instance_url;
//     this.identityUrl = data.id || this.identityUrl || null;
//   }

//   async parseSuccessResponse(response) {
//     if (response.status === 204) {
//       return { success: true };
//     }

//     const contentType = response.headers.get("content-type") || "";

//     if (contentType.includes("application/json")) {
//       return response.json();
//     }

//     const text = await response.text();
//     return text ? { success: true, raw: text } : { success: true };
//   }

//   // ================= USER =================
//   async getUserInfo() {
//     const url = this.identityUrl;

//     if (!url) {
//       throw new Error("Missing Salesforce identity URL. Please log in again.");
//     }

//     const response = await this.makeProxiedRequest(url);

//     if (!response.ok) {
//       const message = await this.readErrorResponse(
//         response,
//         `User fetch failed with status ${response.status}`
//       );
//       throw new Error(message);
//     }

//     return await response.json();
//   }

//   // ================= VALIDATION RULES =================
//   async getValidationRulesTooling() {
//     const query = `
//       SELECT Id, ValidationName, Active
//       FROM ValidationRule
//       WHERE EntityDefinition.QualifiedApiName = 'Account'
//     `;

//     const url = `${this.instanceUrl}/services/data/v${SALESFORCE_API_VERSION}/tooling/query?q=${encodeURIComponent(query)}`;
//     const response = await this.makeProxiedRequest(url);

//     if (!response.ok) {
//       const message = await this.readErrorResponse(
//         response,
//         `Fetch failed with status ${response.status}`
//       );
//       throw new Error(message);
//     }

//     const data = await response.json();

//     const rules = (data.records || []).map(rule => ({
//       id: rule.Id,
//       name: rule.ValidationName,
//       fullName: `Account.${rule.ValidationName}`,
//       active: rule.Active,
//       description: "",
//       errorMessage: "",
//       errorConditionFormula: rule.ErrorConditionFormula || ""
//     }));

//     return rules;
//   }

//   // ================= METADATA =================
//   async getValidationRuleMetadata(ruleId) {
//     try {
//       const query = `
//         SELECT Id, Metadata
//         FROM ValidationRule
//         WHERE Id = '${ruleId}'
//       `;
//       const url = `${this.instanceUrl}/services/data/v${SALESFORCE_API_VERSION}/tooling/query?q=${encodeURIComponent(query)}`;
//       const response = await this.makeProxiedRequest(url);

//       if (!response.ok) return null;

//       const data = await response.json();
//       return data.records?.[0]?.Metadata || null;
//     } catch {
//       return null;
//     }
//   }

//   async patchValidationRule(ruleId, body) {
//     const url = `${this.instanceUrl}/services/data/v${SALESFORCE_API_VERSION}/tooling/sobjects/ValidationRule/${ruleId}`;
//     return this.makeProxiedRequest(url, "PATCH", body);
//   }

//   // ================= UPDATE (CORRECT WAY) =================
//   async updateValidationRuleStatus(rule) {
//     try {
//       if (!rule || !rule.id || !rule.fullName) {
//         throw new Error("Validation rule record is incomplete.");
//       }

//       const directResponse = await this.patchValidationRule(rule.id, {
//         Active: rule.active,
//       });

//       if (directResponse.ok) {
//         return this.parseSuccessResponse(directResponse);
//       }

//       const directError = await this.readErrorResponse(
//         directResponse,
//         `Update failed with status ${directResponse.status}`
//       );

//       const metadata = await this.getValidationRuleMetadata(rule.id);

//       if (!metadata) {
//         throw new Error(`Metadata fetch failed after direct update attempt: ${directError}`);
//       }

//       const response = await this.patchValidationRule(rule.id, {
//         FullName: rule.fullName,
//         Metadata: {
//           ...metadata,
//           active: rule.active,
//         },
//       });

//       if (!response.ok) {
//         const message = await this.readErrorResponse(
//           response,
//           `Update failed with status ${response.status}`
//         );
//         throw new Error(message);
//       }

//       return this.parseSuccessResponse(response);

//     } catch (error) {
//       console.error("Update error:", error);
//       throw error;
//     }
//   }

//   // ================= BULK =================
//   async bulkUpdateValidationRules(rules) {
//     for (const rule of rules) {
//       await this.updateValidationRuleStatus(rule);
//     }
//     return { success: true, updatedCount: rules.length };
//   }

//   // ================= REFRESH =================
//   async refreshAccessToken() {
//     const response = await fetch(SALESFORCE_TOKEN_PROXY_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         grant_type: "refresh_token",
//         refresh_token: this.refreshToken,
//         client_id: SALESFORCE_CLIENT_ID,
//       }),
//     });

//     if (!response.ok) {
//       this.logout();
//       const message = await this.readErrorResponse(
//         response,
//         "Session expired"
//       );
//       throw new Error(message);
//     }

//     const data = await response.json();
//     this.storeSession({
//       ...data,
//       instance_url: this.instanceUrl,
//       id: this.identityUrl,
//     });

//     return data;
//   }

//   // ================= LOGOUT =================
//   logout() {
//     localStorage.clear();
//     sessionStorage.clear();
//     this.accessToken = null;
//     this.instanceUrl = null;
//     this.identityUrl = null;
//     this.refreshToken = null;
//   }

//   // ================= AUTH =================
//   isAuthenticated() {
//     return !!this.accessToken && !!this.instanceUrl && !!this.identityUrl;
//   }
// }

// const salesforceService = new SalesforceService();

// export default salesforceService;
const API_BASE_URL = "https://salesforce-assignment.onrender.com";

const SalesforceService = {
  isAuthenticated: () => true,

  logout: () => {
    console.log("Logout called (bypassed)");
  },

  // Dummy user info
  getUserInfo: async () => {
    return {
      name: "Demo User",
      email: "demo@salesforce.com"
    };
  },

  // Fetch validation rules
  getValidationRulesTooling: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rules`);
      if (!response.ok) {
        throw new Error("Failed to fetch rules");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching rules:", error);
      return [];
    }
  },

  // Optional duplicate
  getValidationRules: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rules`);
      if (!response.ok) {
        throw new Error("Failed to fetch rules");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching rules:", error);
      return [];
    }
  },

  // Update rule
  updateValidationRule: async (ruleName, isActive) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rules/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ruleName, isActive })
      });

      if (!response.ok) {
        throw new Error("Failed to update rule");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating rule:", error);
      return null;
    }
  },

  // ✅ FIX: Add this function (IMPORTANT)
  updateValidationRuleStatus: function(ruleName, isActive) {
    return this.updateValidationRule(ruleName, isActive);
  }
};

export default SalesforceService;