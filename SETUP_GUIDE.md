# Salesforce Validation Rules Manager - Complete Setup Guide

## Overview

This is a production-ready React application that manages Salesforce Account validation rules through a user-friendly web interface. It uses OAuth 2.0 authentication and Salesforce's Metadata & Tooling APIs.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   React Web Application                      │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────────────┐ │
│  │  Login Page  │→ │OAuth Flow   │→ │Validation Rules Mgr│ │
│  └──────────────┘  └─────────────┘  └────────────────────┘ │
│                          ↓                      ↓             │
│                   SalesforceService         Fetch/Update      │
│                          ↓                      ↓             │
└─────────────────────────────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────┐
        │     Salesforce OAuth Server      │
        │  /services/oauth2/authorize      │
        │  /services/oauth2/token          │
        └──────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────┐
        │   Salesforce Tooling API         │
        │  /services/data/v61.0/tooling/   │
        │  - Query ValidationRules         │
        │  - Update Rule Status            │
        └──────────────────────────────────┘
```

## Phase 1: Salesforce Setup (Must Complete First)

### A. Create Salesforce Developer Org

1. Go to [https://developer.salesforce.com/signup](https://developer.salesforce.com/signup)
2. Complete the registration form
3. Verify your email
4. Set your password
5. Log in to your new org

### B. Create Validation Rules on Account Object

In your Salesforce org:

1. Navigate to: **Setup** → **Objects and Fields** → **Account**
2. In left sidebar, find **Validation Rules**
3. Click **New** button

#### Rule 1: Account Name Required
```
Name: Account_Name_Required
Description: Ensures an Account name is provided
Entity: Account
Error Location: (Field doesn't matter)
Error Message: Account Name is required
Formula: ISBLANK(Name)
Active: Check
```

#### Rule 2: Annual Revenue Validation
```
Name: Annual_Revenue_Validation
Description: Annual Revenue must be positive if provided
Entity: Account
Error Message: Annual Revenue must be greater than zero
Formula: AND(NOT(ISBLANK(AnnualRevenue)), AnnualRevenue <= 0)
Active: Check
```

#### Rule 3: Phone Number Validation
```
Name: Phone_Number_Validation
Description: Phone number format validation
Entity: Account
Error Message: Please enter a valid phone number
Formula: AND(NOT(ISBLANK(Phone)), NOT(REGEX(Phone, "[0-9()\\-\\s\\.\\+]+")))
Active: Check
```

#### Rule 4: Website URL Validation
```
Name: Website_URL_Validation
Description: Website must be a valid URL
Entity: Account
Error Message: Website must start with http:// or https://
Formula: AND(NOT(ISBLANK(Website)), NOT(OR(STARTS(Website, "http://"), STARTS(Website, "https://"))))
Active: Check
```

#### Rule 5: Industry Selection
```
Name: Industry_Selection_Required
Description: Industry field should be selected
Entity: Account
Error Message: Please select an Industry for this Account
Formula: AND(ISNULL(Industry), NOT(ISBLANK(Name)))
Active: Check
```

### C. Create Connected App

1. In Salesforce, go to: **Setup** → **Apps** → **App Manager**
2. Click **New Connected App** (top right)

**Basic Information Section:**
- Connected App Name: `Salesforce Validation Rules Manager`
- API Name: `Salesforce_Validation_Rules_Manager`
- Contact Email: Your email address
- Description: Web app to manage Account validation rules

**API (Enable OAuth Settings) Section:**
✓ Check: "Enable OAuth Settings"

**Callback URL:**
```
http://localhost:3000/callback
```

**Selected OAuth Scopes** - Add all these:
- Access and manage your data (`api`)
- Full access (`full`)
- Refresh token, offline access (`refresh_token`, `offline_access`)

**Other Settings:**
✓ Check: "Require Secret for Server-to-Server Flow"

Click **Save**

**After saving:**
1. Click **Continue**
2. Go to **Manage** section
3. Click **Edit Policies**
4. Under "OAuth policies": Select **Admin approved users are pre-authorized**
5. Click **Save**
6. Go to **Keys & Secrets** tab
7. Copy **Consumer Key** (this is your Client ID)
8. Next to **Client Secret**, click **Show** and copy it

**Store these securely - you'll need them next!**

---

## Phase 2: Local Application Setup

### Step 1: Install Node.js & npm

Download from [https://nodejs.org/](https://nodejs.org/) (LTS version recommended)

Verify installation:
```bash
node --version   # Should show v16 or higher
npm --version    # Should show 8 or higher
```

### Step 2: Clone/Download Project

Navigate to your project folder:
```bash
cd salesforce-ui
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install React, Axios, and other required packages.

### Step 4: Create Environment File

Create a file named `.env` in the root directory:
```bash
Windows (PowerShell):
New-Item -Path ".env" -ItemType File

Mac/Linux:
touch .env
```

### Step 5: Configure Environment Variables

Open `.env` and add:
```
REACT_APP_SALESFORCE_CLIENT_ID=your_client_id_pasted_here
REACT_APP_SALESFORCE_CLIENT_SECRET=your_client_secret_pasted_here
REACT_APP_SALESFORCE_REDIRECT_URI=http://localhost:3000/callback
REACT_APP_SALESFORCE_AUTH_URL=https://login.salesforce.com
```

⚠️ **Important**: 
- For **Production Salesforce**: Use `https://login.salesforce.com`
- For **Sandbox**: Use `https://test.salesforce.com`
- Never commit `.env` to version control

### Step 6: Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

---

## Phase 3: Using the Application

### Login Flow

1. Click **"Login with Salesforce"** button
2. You'll be redirected to Salesforce login
3. Enter your Salesforce credentials
4. Approve the permissions requested
5. You'll be redirected back to the app

### Main Features

#### 📊 Dashboard Stats
- **Total Rules**: Count of all Account validation rules
- **Active Rules**: Number of currently active rules
- **Inactive Rules**: Number of currently inactive rules

#### 📋 Validation Rules Table
Shows all rules with:
- Rule Name
- Description
- Error Message
- Current Status (Active/Inactive)
- Quick-toggle Action Button

#### 🎯 Individual Rule Control
Click **⊙** (activate) or **⊗** (deactivate) to toggle a single rule

#### 📦 Bulk Operations
1. Use **☑ Select All** checkbox to select all rules
2. Or manually check specific rules
3. Click **✓ Activate** or **✗ Deactivate** for bulk changes

#### 🚀 Deploy to Salesforce
1. Make all your changes (activate/deactivate rules)
2. Click **🚀 Deploy to Salesforce**
3. Wait for deployment confirmation
4. Deployment is now live in your Salesforce org!

#### 🔄 Refresh
Click **Refresh** to reload the latest rules from Salesforce

#### 🚪 Logout
Click **Logout** in the top-right corner to end your session

---

## API Reference

### OAuth 2.0 Authorization Flow

1. **Authorization URL**
   ```
   https://login.salesforce.com/services/oauth2/authorize?
   response_type=code&
   client_id=YOUR_CLIENT_ID&
   redirect_uri=http://localhost:3000/callback&
   scope=full%20refresh_token%20api
   ```

2. **Token Exchange**
   ```
   POST /services/oauth2/token
   grant_type: authorization_code
   code: <auth_code>
   client_id: YOUR_CLIENT_ID
   client_secret: YOUR_CLIENT_SECRET
   redirect_uri: http://localhost:3000/callback
   ```

### Tooling API - Query Validation Rules

```
GET /services/data/v61.0/tooling/query?q=
SELECT Id, DeveloperName, ValidationName, Description, 
       ErrorMessage, Active, ErrorConditionFormula 
FROM ValidationRule 
WHERE EntityDefinition.QualifiedName = 'Account'
```

### Tooling API - Update Rule Status

```
PATCH /services/data/v61.0/tooling/sobjects/ValidationRule/{Id}
Body: { "Active": true/false }
```

### Metadata API - Deploy Changes

```
POST /services/data/v61.0/metadata/deploy
Body: {
  "apiVersion": "61.0",
  "checkOnly": false,
  "rollbackOnError": true,
  "singlePackage": true,
  "types": [{
    "members": ["Account.RuleName"],
    "name": "ValidationRule"
  }]
}
```

---

## File Structure

```
salesforce-ui/
│
├── public/
│   ├── index.html          ← Main HTML file
│   ├── manifest.json       ← PWA manifest
│   └── robots.txt
│
├── src/
│   ├── App.js              ← Main component (routing)
│   ├── App.css             ← App styles
│   ├── App.test.js         ← App tests
│   │
│   ├── Login.js            ← Login page component
│   ├── Login.css           ← Login page styles
│   │
│   ├── ValidationRules.js  ← Main feature component
│   ├── ValidationRules.css ← Feature styles
│   │
│   ├── Callback.js         ← OAuth callback handler
│   ├── Callback.css        ← Callback styles
│   │
│   ├── SalesforceService.js    ← API service layer
│   │
│   ├── index.js            ← React entry point
│   ├── index.css           ← Global styles
│   ├── index.test.js       ← Setup tests
│   ├── reportWebVitals.js  ← Performance monitoring
│   └── setupTests.js       ← Test configuration
│
├── .env.example            ← Environment template
├── package.json            ← Dependencies & scripts
├── package-lock.json       ← Lock file
└── README.md               ← This file
```

---

## Component Details

### App.js
**Purpose**: Main application shell  
**Responsibilities**:
- Authentication state management
- Routing between Login, ValidationRules, and Callback
- User session management

**Flow**:
```
Check if authenticated
├── Yes → Show ValidationRules component
├── In Callback → Show Callback component
└── No → Show Login component
```

### Login.js
**Purpose**: Initial login page  
**Features**:
- Displays setup instructions
- OAuth login button
- Links to create Salesforce account
- Beautiful gradient design

**OAuth Redirect**: 
- Clicking login → Redirects to Salesforce
- Salesforce→back to `/callback`

### ValidationRules.js
**Purpose**: Main management interface  
**Features**:
- Display rules in interactive table
- Toggle individual rules
- Bulk select and operate
- Deploy changes
- Shows statistics
- Real-time status updates

**Data Flow**:
```
Mount → Fetch Rules → Display Table → User Actions → Update → Deploy
```

### Callback.js
**Purpose**: OAuth redirect handler  
**Responsibilities**:
- Extract authorization code from URL
- Exchange code for access token
- Store token in localStorage
- Redirect to main app

**Status Indicators**:
- Processing → Token exchange in progress
- Success → Redirecting to app
- Error → Show error message & retry link

### SalesforceService.js
**Purpose**: Centralized API communication  
**Methods**:
- `getLoginUrl()` - Returns Salesforce login URL
- `getAccessToken(code)` - Exchanges auth code for token
- `refreshAccessToken()` - Gets new token
- `getUserInfo()` - Fetches logged-in user info
- `getValidationRulesTooling()` - Fetches validation rules
- `updateValidationRuleStatus(id, active)` - Toggles rule
- `deployValidationRules(rules)` - Deploys changes
- `checkDeploymentStatus(deployId)` - Checks deployment progress
- `logout()` - Clears stored tokens

**Error Handling**:
- Automatic token refresh on 401
- User session clearance on auth failure
- Detailed error messages

---

## Deployment Guide

### Option 1: Deploy to Heroku (Recommended)

1. **Create Heroku Account**: https://www.heroku.com/

2. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli

3. **Create App**:
   ```bash
   heroku create your-app-name-here
   ```

4. **Set Environment Variables**:
   ```bash
   heroku config:set REACT_APP_SALESFORCE_CLIENT_ID=your_id
   heroku config:set REACT_APP_SALESFORCE_CLIENT_SECRET=your_secret
   heroku config:set REACT_APP_SALESFORCE_REDIRECT_URI=https://your-app-name-here.herokuapp.com/callback
   heroku config:set REACT_APP_SALESFORCE_AUTH_URL=https://login.salesforce.com
   ```

5. **Update Salesforce Connected App**:
   - Go back to Salesforce
   - Connected App → Edit → Callback URL
   - Change from `http://localhost:3000/callback` to your Heroku callback URL
   - Save

6. **Deploy**:
   ```bash
   git push heroku main
   ```

7. **View App**:
   ```bash
   heroku open
   ```

### Option 2: Deploy to Netlify

1. **Push to GitHub** (Netlify requirement)

2. **Connect to Netlify**:
   - Go to https://netlify.com
   - Click "Connect to Git"
   - Select your repository
   - Set build command: `npm build`
   - Set publish directory: `build`

3. **Add Environment Variables** in Netlify dashboard

4. **Deploy** automatically on push

### Option 3: Deploy to Azure

1. Create an Azure App Service
2. Connect your GitHub repository
3. Set environment variables in Azure
4. GitHub actions will auto-deploy

---

## Troubleshooting

### Common Issues

**"Failed to get access token"**
- ✓ Verify Client ID in Connected App
- ✓ Verify Client Secret matches
- ✓ Check Redirect URI matches exactly
- ✓ Verify Salesforce org is active
- ✓ Try re-creating the Connected App

**"401 Unauthorized"**
- App will auto-refresh token
- If persists: Click Logout and Login again
- Check token not expired in browser storage

**"Cannot fetch validation rules"**
- Refresh page
- Check internet connection
- Verify Connected App has proper permissions
- Try accessing Salesforce directly to verify access

**"Deploy failed"**
- Check you have deployment privilege
- Verify no conflicting metadata
- Try deploying single rule first
- Check org deployment queue

**"CORS Error"**
- This is normal - Salesforce handles CORS
- App uses correct API endpoints
- Usually resolves on retry

---

## Development Tips

### Browser Developer Tools

1. **F12 or Right-click → Inspect**
2. **Console Tab**: See error messages
3. **Application Tab → localStorage**: See stored tokens
4. **Network Tab**: Monitor API calls to Salesforce

### Debugging

Add console logs in SalesforceService.js:
```javascript
console.log('Token:', this.accessToken);
console.log('Rules:', rules);
```

### Local Testing

```bash
# Start dev server
npm start

# Run tests
npm test

# Build for production
npm build
```

---

## Security Best Practices

✓ **OAuth 2.0**: Industry-standard authentication (not storing passwords)  
✓ **Token Storage**: Tokens in localStorage (cleared on logout)  
✓ **API Validation**: Input validation on all requests  
✓ **HTTPS**: Always use HTTPS in production  
✓ **Environment Variables**: Secrets never in code  
✓ **Permission Scoping**: Only requesting necessary scopes  

---

## Architecture Decisions

**Why OAuth 2.0?**
- Industry standard for secure authentication
- User credentials never handled by our app
- Tokens can be revoked
- Permissions are granular and transparent

**Why Tooling API?**
- Real-time updates without deployment required
- Direct manipulation of validation rules
- Allows individual rule updates

**Why React?**
- Component-based architecture
- Excellent for interactive UIs
- Large ecosystem and community
- Easy state management

**Why Fetch API + Axios?**
- Standard for API communication
- Automatic JSON parsing
- Request/response interceptors

---

## Next Steps

1. ✓ Set up Salesforce org with Connected App
2. ✓ Create validation rules in Salesforce
3. ✓ Install dependencies: `npm install`
4. ✓ Configure `.env` file
5. ✓ Start app: `npm start`
6. ✓ Login and test functionality
7. ✓ Deploy to production server

---

## Support & Resources

- **Salesforce Docs**: https://developer.salesforce.com/docs
- **OAuth Guide**: https://developer.salesforce.com/docs/atlas.en-us.oauth.meta/oauth/
- **Tooling API**: https://developer.salesforce.com/docs/atlas.en-us.api_tooling.meta/api_tooling/
- **React Docs**: https://react.dev

---

**You're all set! Start managing your Salesforce validation rules! 🚀**
