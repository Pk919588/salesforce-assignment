# Developer Documentation - Salesforce Validation Rules Manager

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Component Deep Dive](#component-deep-dive)
4. [API Integration](#api-integration)
5. [State Management](#state-management)
6. [Error Handling](#error-handling)
7. [Extending the Application](#extending-the-application)
8. [Testing Guide](#testing-guide)
9. [Performance Tips](#performance-tips)
10. [Common Patterns](#common-patterns)

---

## Architecture Overview

### High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                    React Component Tree                      │
├─────────────────────────────────────────────────────────────┤
│  App (Root)                                                  │
│  ├── Login (Unauthenticated)                                 │
│  ├── Callback (OAuth Redirect)                               │
│  └── ValidationRules (Authenticated)                         │
│      ├── Navbar                                              │
│      ├── Stats Cards                                         │
│      ├── Control Buttons                                     │
│      ├── Rules Table                                         │
│      └── Info Section                                        │
└─────────────────────────────────────────────────────────────┘
         ↓
    SalesforceService (Singleton)
    ├── OAuth Logic
    ├── API Calls
    ├── Token Management
    └── Error Handling
         ↓
    Browser Storage (localStorage)
    ├── Access Token
    ├── Instance URL
    └── Refresh Token
         ↓
    Salesforce Cloud APIs
    ├── OAuth Server
    ├── Tooling API
    └── Metadata API
```

### Data Flow

```
User Login
    ↓
OAuth Authorization (Salesforce)
    ↓
Authorization Code Exchange
    ↓
Token Storage (localStorage)
    ↓
ValidationRules Component Mount
    ↓
Fetch Rules via Tooling API
    ↓
Render Table with Rules
    ├── User toggles rule
    │   ↓
    │   Update API call
    │   ↓
    │   UI state update
    │
    └── User clicks Deploy
        ↓
        Deployment API call
        ↓
        Monitor deployment status
        ↓
        Show completion message
```

---

## Project Structure

### Root Level Files

```
salesforce-ui/
├── .env.example          # Environment template
├── package.json          # Dependencies & scripts
├── package-lock.json     # Dependency lock file
├── README.md             # Project overview
├── SETUP_GUIDE.md        # Complete setup instructions
├── CHECKLIST.md          # Verification checklist
├── DEVELOPER.md          # This file
│
├── public/               # Static files served as-is
│   ├── index.html        # React app root
│   ├── manifest.json     # PWA metadata
│   └── robots.txt        # SEO robots file
│
└── src/                  # Source code
    ├── index.js          # React entry point
    ├── App.js            # Root component
    ├── SalesforceService.js  # API layer
    ├── config.js         # Configuration
    │
    ├── pages/components
    ├── Login.js          # Login screen
    ├── ValidationRules.js    # Main feature
    ├── Callback.js       # OAuth handler
    │
    ├── styles
    ├── App.css           # App styles
    ├── Login.css         # Login styles
    ├── ValidationRules.css   # Feature styles
    ├── Callback.css      # Callback styles
    └── index.css         # Global styles
```

### Key Files

| File | Purpose | Lines |
|------|---------|-------|
| `App.js` | Main component, routing logic | ~40 |
| `Login.js` | Login page UI | ~70 |
| `ValidationRules.js` | Main feature component | ~300+ |
| `Callback.js` | OAuth callback handler | ~50 |
| `SalesforceService.js` | API layer, service logic | ~250+ |
| `config.js` | Configuration constants | ~80 |

---

## Component Deep Dive

### App.js

**Purpose**: Root component that manages authentication state and routing

**State Variables**:
```javascript
- isAuthenticated: boolean   // User logged in?
- isCallback: boolean       // In OAuth callback?
- loading: boolean          // Initial load?
```

**Key Methods**:
```javascript
useEffect()              // Check auth on mount
handleLoginSuccess()     // Update auth state
handleLogout()          // Clear auth state
```

**Routing Logic**:
```
if (loading) → Show loading spinner
else if (isCallback) → Show Callback component
else if (isAuthenticated) → Show ValidationRules
else → Show Login
```

### Login.js

**Purpose**: Display login page with OAuth button

**Features**:
- OAuth login redirect button
- Setup instructions
- Links for new users
- Responsive gradient design

**Key Handler**:
```javascript
handleLogin() {
  // Redirect to Salesforce OAuth URL
  window.location.href = SalesforceService.getLoginUrl()
}
```

**Props**:
```javascript
{
  onLoginSuccess: function  // Called after successful login
}
```

### ValidationRules.js

**Purpose**: Main application interface for managing rules

**State Variables**:
```javascript
validationRules: []         // Array of rule objects
loading: boolean           // Fetching data?
error: string             // Error message
userInfo: object          // Logged-in user data
deploying: boolean        // Deploying?
deployStatus: object      // Deployment message
selectedRules: Set        // Selected rule IDs
updatingRuleId: string    // Currently updating rule
```

**Key Methods**:

```javascript
// Execution Flow
fetchData()                    // Get rules & user info
toggleRuleStatus()             // Toggle single rule
toggleRuleSelection()          // Select/deselect rule
toggleAllRules()               // Select/deselect all
toggleSelectedRulesStatus()    // Bulk toggle
handleDeploy()                 // Deploy changes
```

**Rendering Sections**:
1. Navbar - User info & logout
2. Stats Cards - Counters
3. Action Buttons - Controls
4. Rules Table - Main display
5. Info Section - Help text

### Callback.js

**Purpose**: Handle OAuth redirect and token exchange

**Execution Flow**:
```javascript
useEffect() on mount
  → Get auth code from URL
  → Check for errors
  → Exchange code for token
  → Store token in localStorage
  → Redirect to app
```

**Status States**:
- `processing` - Exchanging token
- `success` - Token received, redirecting
- `error` - Auth failed

### SalesforceService.js

**Purpose**: Centralized API communication layer

**Constructor**:
```javascript
this.accessToken = localStorage.getItem('sfAccessToken')
this.instanceUrl = localStorage.getItem('sfInstanceUrl')
this.refreshToken = localStorage.getItem('sfRefreshToken')
```

**Key Methods**:

```javascript
// Authentication
getLoginUrl()              // Returns Salesforce login URL
getAccessToken(code)       // Exchange auth code for tokens
refreshAccessToken()       // Get new access token
logout()                   // Clear all tokens

// User Info
getUserInfo()              // Get logged-in user data

// Validation Rules
getValidationRulesTooling()    // Fetch all rules
updateValidationRuleStatus()   // Toggle rule on/off

// Deployment
deployValidationRules()        // Deploy changes
checkDeploymentStatus()        // Check deployment progress

// Utilities
isAuthenticated()          // Check auth status
```

**Error Handling Pattern**:
```javascript
try {
  // API call
  if (!response.ok) {
    if (response.status === 401) {
      // Auto-refresh token
      await this.refreshAccessToken()
      // Retry request
      return this.originalMethod()
    }
    throw new Error('API Error')
  }
  return response.json()
} catch (error) {
  // Handle error
  throw error
}
```

---

## API Integration

### OAuth 2.0 Flow

**Step 1: Authorization Request**
```javascript
GET https://login.salesforce.com/services/oauth2/authorize?
  response_type=code&
  client_id=YOUR_CLIENT_ID&
  redirect_uri=http://localhost:3000/callback&
  scope=full%20refresh_token%20api&
  prompt=login
```

**Step 2: User Authorization**
- User logs in
- Grants permissions
- Salesforce redirects to callback URL with code

**Step 3: Token Exchange**
```javascript
POST https://login.salesforce.com/services/oauth2/token
{
  grant_type: "authorization_code",
  code: "authorization_code_from_step2",
  client_id: "YOUR_CLIENT_ID",
  client_secret: "YOUR_CLIENT_SECRET",
  redirect_uri: "http://localhost:3000/callback"
}

Response:
{
  "access_token": "token_here",
  "instance_url": "https://abc123.salesforce.com",
  "refresh_token": "refresh_token_here",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Tooling API - Query Rules

**Request**:
```javascript
GET https://abc123.salesforce.com/services/data/v61.0/tooling/query?q=
SELECT Id, DeveloperName, ValidationName, Description, 
       ErrorMessage, Active, ErrorConditionFormula 
FROM ValidationRule 
WHERE EntityDefinition.QualifiedName = 'Account'

Headers:
Authorization: Bearer {access_token}
```

**Response**:
```javascript
{
  "records": [
    {
      "Id": "xxxxxxxxxxxxxxxx",
      "DeveloperName": "Account_Name_Required",
      "ValidationName": "Account Name Required",
      "Description": "Ensures account name is provided",
      "ErrorMessage": "Please enter account name",
      "Active": true,
      "ErrorConditionFormula": "ISBLANK(Name)",
      "attributes": {
        "type": "ValidationRule"
      }
    },
    // ... more rules
  ],
  "totalSize": 5,
  "done": true
}
```

### Tooling API - Update Rule Status

**Request**:
```javascript
PATCH https://abc123.salesforce.com/services/data/v61.0/tooling/sobjects/ValidationRule/{Id}
Content-Type: application/json
Authorization: Bearer {access_token}

Body:
{
  "Active": true
}
```

**Response**: 204 No Content (success)

---

## State Management

### Component State Management

**ValidationRules.js** uses local component state with `useState`:

```javascript
const [validationRules, setValidationRules] = useState([])
const [selectedRules, setSelectedRules] = useState(new Set())
```

### Persistent State (localStorage)

**SalesforceService** manages auth state:
```javascript
localStorage.setItem('sfAccessToken', token)
localStorage.setItem('sfInstanceUrl', url)
localStorage.setItem('sfRefreshToken', refreshToken)
```

**Cleaning auth state**:
```javascript
localStorage.removeItem('sfAccessToken')
localStorage.removeItem('sfInstanceUrl')
localStorage.removeItem('sfRefreshToken')
```

---

## Error Handling

### Error Types

**Authentication Errors**
```javascript
const authError = 'Failed to authenticate with Salesforce'
→ Show Login page
→ Clear tokens
```

**API Errors**
```javascript
const apiError = 'Failed to fetch validation rules'
→ Show error message
→ Provide retry option
```

**Network Errors**
```javascript
const networkError = 'Network connection failed'
→ Show error banner
→ Allow user to retry
```

### Error Handling Pattern

```javascript
try {
  const rules = await SalesforceService.getValidationRulesTooling()
  setValidationRules(rules)
} catch (err) {
  console.error('Error fetching data:', err)
  
  // Check error type
  if (err.message.includes('401')) {
    // Auth failed - redirect to login
    onLogout()
  } else {
    // Other error - show message
    setError('Failed to fetch validation rules: ' + err.message)
  }
}
```

---

## Extending the Application

### Add Support for Other Objects

**Modify SalesforceService.js**:

```javascript
// Add new method
async getValidationRulesByObject(objectName) {
  const query = `SELECT Id, DeveloperName, Active FROM ValidationRule 
                 WHERE EntityDefinition.QualifiedName = '${objectName}'`
  // ... fetch and return
}
```

### Add Custom Validation Rule Creation

**Add new component** `CreateRule.js`:

```javascript
function CreateRule({ onRuleCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    formula: '',
    errorMessage: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Call API to create rule
    const result = await SalesforceService.createValidationRule(formData)
    onRuleCreated(result)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

### Add Real-time Deployment Status

**Enhance Callback.js monitoring**:

```javascript
// Check deployment status every 2 seconds
const checkInterval = setInterval(async () => {
  const status = await SalesforceService.checkDeploymentStatus(deployId)
  
  if (status.done) {
    clearInterval(checkInterval)
    setDeployStatus('Deployment complete!')
  } else {
    setDeployStatus(`${status.numberComponentsDeployed}/${status.numberComponentsTotal}`)
  }
}, 2000)
```

### Add Export/Import Rules

**Add export functionality**:

```javascript
const exportRules = () => {
  const json = JSON.stringify(validationRules, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `validation-rules-${Date.now()}.json`
  link.click()
}
```

---

## Testing Guide

### Unit Testing Example

```javascript
// ValidationRules.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import ValidationRules from './ValidationRules'

describe('ValidationRules Component', () => {
  test('renders validation rules table', () => {
    render(<ValidationRules onLogout={jest.fn()} />)
    expect(screen.getByText('Validation Rules')).toBeInTheDocument()
  })

  test('toggles rule selection', () => {
    const { getByRole } = render(<ValidationRules onLogout={jest.fn()} />)
    const checkbox = getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  })
})
```

### E2E Testing with Cypress

```javascript
// cypress/integration/validation-rules.spec.js
describe('Validation Rules Manager', () => {
  it('logs in and views validation rules', () => {
    cy.visit('http://localhost:3000')
    cy.contains('Login with Salesforce').click()
    // ... OAuth flow
    cy.contains('Validation Rules').should('be.visible')
  })
})
```

---

## Performance Tips

### 1. Optimize Re-renders

Use `useMemo` for expensive operations:

```javascript
const activeRulesCount = useMemo(() => 
  validationRules.filter(r => r.active).length,
  [validationRules]
)
```

### 2. Debounce Search Input

```javascript
const [searchTerm, setSearchTerm] = useState('')
const debouncedSearch = useMemo(() => 
  debounce((value) => filterRules(value), 300),
  []
)
```

### 3. Virtualize Long Lists

For large rule lists, use react-window:

```javascript
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={rules.length}
  itemSize={35}
  width={'100%'}
>
  {({ index, style }) => (
    <div style={style}>
      {rules[index].name}
    </div>
  )}
</FixedSizeList>
```

### 4. Code Splitting

Split by route:

```javascript
const Login = lazy(() => import('./Login'))
const ValidationRules = lazy(() => import('./ValidationRules'))

<Suspense fallback={<Loading />}>
  {isAuthenticated ? <ValidationRules /> : <Login />}
</Suspense>
```

---

## Common Patterns

### Pattern 1: Loading State Management

```javascript
const [loading, setLoading] = useState(false)

const fetchData = async () => {
  try {
    setLoading(true)
    const data = await api.fetch()
    setData(data)
  } finally {
    setLoading(false)  // Always cleanup
  }
}
```

### Pattern 2: Error Boundary

```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

### Pattern 3: Custom Hook for API Calls

```javascript
function useValidationRules() {
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRules = async () => {
      try {
        setLoading(true)
        const data = await SalesforceService.getValidationRulesTooling()
        setRules(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRules()
  }, [])

  return { rules, loading, error, refetch }
}
```

---

## Debugging Tips

### 1. Check localStorage

```javascript
// In browser console
console.log(localStorage.getItem('sfAccessToken'))
console.log(localStorage.getItem('sfInstanceUrl'))
```

### 2. Monitor API Calls

- Open DevTools → Network tab
- Filter by XHR/Fetch
- Check request/response headers and body

### 3. React DevTools Extension

- Install React DevTools browser extension
- View component tree
- Track state changes
- Profile performance

### 4. Add Debug Logs

```javascript
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}
```

---

## Build Commands

```bash
# Development
npm start              # Start dev server
npm test               # Run tests
npm test -- --coverage # Coverage report

# Production
npm build              # Create production build
```

---

## Deployment Checklist

- [ ] All tests passing: `npm test`
- [ ] Build successful: `npm build`
- [ ] No console errors in production build
- [ ] Environment variables set correctly
- [ ] Salesforce Connected App callback URL updated
- [ ] HTTPS enabled on production
- [ ] Error tracking set up (Sentry, etc.)
- [ ] Performance monitoring enabled
- [ ] Backup and restore procedure documented

---

## Resources

- [React Documentation](https://react.dev)
- [Salesforce Developer Docs](https://developer.salesforce.com/docs)
- [OAuth 2.0 Spec](https://oauth.net/2/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Happy coding! 🚀**
