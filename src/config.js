/**
 * Salesforce API Configuration
 * Contains all endpoint configurations and OAuth settings
 */

export const SALESFORCE_CONFIG = {
  // OAuth Configuration
  oauth: {
    authorizePath: '/services/oauth2/authorize',
    tokenPath: '/services/oauth2/token',
    userinfoPath: '/services/oauth2/userinfo',
    revokeTokenPath: '/services/oauth2/revoke',
    scopes: ['full', 'refresh_token', 'api'],
  },

  // API Endpoints
  api: {
    version: 'v61.0',
    tooling: (baseUrl, path = '') => `${baseUrl}/services/data/v61.0/tooling${path}`,
    metadata: (baseUrl, path = '') => `${baseUrl}/services/data/v61.0/metadata${path}`,
    data: (baseUrl, path = '') => `${baseUrl}/services/data/v61.0${path}`,
  },

  // SOQL Queries
  queries: {
    validationRules: `
      SELECT 
        Id, 
        DeveloperName, 
        ValidationName, 
        Description, 
        ErrorMessage, 
        Active, 
        ErrorConditionFormula 
      FROM ValidationRule 
      WHERE EntityDefinition.QualifiedName = 'Account'
    `,
  },

  // Metadata Configuration
  metadata: {
    apiVersion: '61.0',
    deployOptions: {
      rollbackOnError: true,
      singlePackage: true,
      checkOnly: false,
    },
  },

  // Error Messages
  errors: {
    AUTH_FAILED: 'Authentication failed. Please try again.',
    TOKEN_REFRESH_FAILED: 'Failed to refresh authentication token. Please login again.',
    API_ERROR: 'An error occurred while communicating with Salesforce.',
    VALIDATION_RULES_ERROR: 'Failed to fetch validation rules.',
    UPDATE_FAILED: 'Failed to update validation rule.',
    DEPLOY_FAILED: 'Failed to deploy changes.',
    DEPLOY_STATUS_ERROR: 'Failed to check deployment status.',
    USER_INFO_ERROR: 'Failed to retrieve user information.',
    INVALID_AUTH_CODE: 'Invalid authorization code received.',
  },

  // Success Messages
  messages: {
    LOGIN_SUCCESS: 'Successfully logged in!',
    LOGOUT_SUCCESS: 'Successfully logged out.',
    UPDATE_SUCCESS: 'Validation rule updated successfully.',
    DEPLOY_SUCCESS: 'Deployment completed successfully!',
    DEPLOY_IN_PROGRESS: 'Deployment is in progress. Please wait...',
  },

  // Retry Configuration
  retry: {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2,
  },

  // Token Configuration
  token: {
    refreshThresholdMs: 5 * 60 * 1000, // Refresh 5 minutes before expiry
    storageKeys: {
      accessToken: 'sfAccessToken',
      instanceUrl: 'sfInstanceUrl',
      refreshToken: 'sfRefreshToken',
      tokenExpiry: 'sfTokenExpiry',
    },
  },

  // UI Configuration
  ui: {
    pageSize: 50,
    debounceMs: 300,
    toastDurationMs: 3000,
  },
};

export default SALESFORCE_CONFIG;
