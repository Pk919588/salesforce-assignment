# ✅ Salesforce Validation Rules Manager - Quick Start Checklist

Use this checklist to verify your setup before running the application.

## Pre-Setup Requirements

- [ ] Node.js v16+ installed (`node --version`)
- [ ] npm v8+ installed (`npm --version`)
- [ ] Git installed (optional)
- [ ] A web browser (Chrome, Firefox, Safari, Edge)
- [ ] Internet connection

## Salesforce Setup

### Developer Org Creation
- [ ] Visited https://developer.salesforce.com/signup
- [ ] Completed registration
- [ ] Verified email address
- [ ] Set password
- [ ] Logged in successfully

### Validation Rules Created
- [ ] Account_Name_Required (Name is blank check)
- [ ] Annual_Revenue_Validation (Revenue positive check)
- [ ] Phone_Number_Validation (Format check)
- [ ] Website_URL_Validation (URL format check)
- [ ] Industry_Selection_Required (Industry selected check)
- [ ] All rules set to Active: ✓

### Connected App Setup
- [ ] Created Connected App in Setup → App Manager
- [ ] App Name: "Salesforce Validation Rules Manager"
- [ ] OAuth Settings: Enabled
- [ ] Callback URL: `http://localhost:3000/callback`
- [ ] Scopes added:
  - [ ] full
  - [ ] refresh_token
  - [ ] api
- [ ] "Require Secret" option: ✓ Checked
- [ ] App saved and managed
- [ ] Consumer Key (Client ID) copied and saved
- [ ] Client Secret copied and saved (store securely!)

## Local Setup

### Project Preparation
- [ ] Navigated to project directory: `cd salesforce-ui`
- [ ] Run: `npm install` (wait for completion)
- [ ] Created `.env` file in project root

### Environment Configuration
- [ ] `.env` file contents:
  ```
  REACT_APP_SALESFORCE_CLIENT_ID=<your_client_id>
  REACT_APP_SALESFORCE_CLIENT_SECRET=<your_client_secret>
  REACT_APP_SALESFORCE_REDIRECT_URI=http://localhost:3000/callback
  REACT_APP_SALESFORCE_AUTH_URL=https://login.salesforce.com
  ```
- [ ] All values filled in correctly
- [ ] No typos in environment variables
- [ ] Saved `.env` file

### Dependency Installation
- [ ] `npm install` completed without errors
- [ ] `node_modules` folder created
- [ ] `package-lock.json` generated

## Application Testing

### Local Development
- [ ] Run: `npm start`
- [ ] Application started on port 3000
- [ ] Browser opened to http://localhost:3000
- [ ] Login page displayed

### OAuth Login Test
- [ ] Clicked "Login with Salesforce" button
- [ ] Redirected to Salesforce login page
- [ ] Entered Salesforce credentials
- [ ] Permission approval screen appeared
- [ ] Clicked "Allow" to authorize
- [ ] Redirected back to application
- [ ] Successfully logged in

### Functionality Verification
- [ ] Validation rules display in table
- [ ] All 5 validation rules visible
- [ ] Rules show correct status (Active/Inactive)
- [ ] Stats card displays correct counts:
  - [ ] Total Rules: 5
  - [ ] Active Rules: (should match your settings)
  - [ ] Inactive Rules: (should match your settings)

### Feature Testing

**Individual Rule Toggle:**
- [ ] Clicked toggle button on a rule
- [ ] Rule status changed
- [ ] System confirmed update

**Bulk Selection:**
- [ ] Clicked "Select All" checkbox
- [ ] All rules selected (highlighted)
- [ ] Clicked "Select All" again to deselect
- [ ] All rules deselected

**Bulk Operations:**
- [ ] Selected multiple rules manually
- [ ] Clicked "Activate" button
- [ ] Rules activated successfully
- [ ] Selected different rules
- [ ] Clicked "Deactivate" button
- [ ] Rules deactivated successfully

**Deployment:**
- [ ] Made changes to rule status
- [ ] Clicked "Deploy to Salesforce" button
- [ ] Deployment status shown
- [ ] Deployment completed successfully
- [ ] Verified changes in Salesforce directly

**Refresh:**
- [ ] Clicked "Refresh" button
- [ ] Rules reloaded from Salesforce
- [ ] Latest status reflected

**Logout:**
- [ ] Clicked "Logout" button
- [ ] Returned to login page
- [ ] Session ended successfully

## Salesforce Verification

**Verify Changes Deployed:**
- [ ] Logged into Salesforce
- [ ] Navigated to Account → Validation Rules
- [ ] Verified rule status matches application
- [ ] Confirmed deployments appeared in all rules list

## Production Deployment Checklist

### Pre-Deployment (Choose One)

**For Heroku:**
- [ ] Created Heroku account
- [ ] Installed Heroku CLI
- [ ] Created Heroku app
- [ ] Set environment variables in Heroku
- [ ] Updated Salesforce Connected App callback URL
- [ ] Callback URL points to: `https://your-app.herokuapp.com/callback`

**For Netlify:**
- [ ] Uploaded project to GitHub
- [ ] Created Netlify account
- [ ] Connected GitHub repository
- [ ] Set build command: `npm build`
- [ ] Set publish directory: `build`
- [ ] Added environment variables
- [ ] Updated Salesforce Connected App callback URL

**For Azure:**
- [ ] Created Azure App Service
- [ ] Connected GitHub repository
- [ ] Added environment variables
- [ ] Updated Salesforce Connected App callback URL
- [ ] Callback URL points to: `https://your-app.azurewebsites.net/callback`

### Post-Deployment Testing
- [ ] Visited production URL
- [ ] Login page displays correctly
- [ ] OAuth login works
- [ ] Can view validation rules
- [ ] Can toggle rules
- [ ] Can deploy changes
- [ ] No console errors

## Advanced Verification

### Browser Console Checks
- [ ] Opened DevTools (F12)
- [ ] Console tab shows no errors
- [ ] Network tab shows successful API calls

### API Communication Check
- [ ] Tokens stored in localStorage ✓
- [ ] Authorization Headers correct in Network tab
- [ ] API responses show validation rules
- [ ] Deployment requests successful

### Performance Check
- [ ] Page loads in < 3 seconds
- [ ] Rules table responsive
- [ ] No lag when toggling rules
- [ ] Deployment completes within reasonable time

## Troubleshooting Steps

If any checkbox is unchecked and causes issues:

**Login Issues:**
- [ ] Cleared browser cache
- [ ] Restarted local server
- [ ] Verified .env variables
- [ ] Re-created Connected App

**Rules Not Loading:**
- [ ] Checked user has read permissions
- [ ] Verified API is enabled in org
- [ ] Checked network requests in DevTools
- [ ] Tried refreshing page

**Deployment Failures:**
- [ ] Verified deployment privileges
- [ ] Checked metadata for conflicts
- [ ] Reviewed deployment logs in Salesforce
- [ ] Tried single rule deployment first

**Token Issues:**
- [ ] Logged out and back in
- [ ] Cleared localStorage manually
- [ ] Verified token not expired
- [ ] Check Connected App is still active

## Success Indicators

Your setup is successful when:

✅ Application loads at http://localhost:3000  
✅ Login with Salesforce works  
✅ All validation rules display  
✅ Can toggle rules on/off  
✅ Deployment completes successfully  
✅ Changes appear in Salesforce  
✅ No console errors  
✅ Responsive on mobile devices  

## Next Steps After Verification

1. **Customize** - Modify styles and branding
2. **Deploy** - Push to production server
3. **Share** - Invite team members to use
4. **Monitor** - Track usage and performance
5. **Enhance** - Add more Salesforce objects support

## Getting Help

If you encounter issues:

1. Check the [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions
2. Review error messages in browser console
3. Check [Salesforce Developer Documentation](https://developer.salesforce.com/docs)
4. Verify OAuth 2.0 setup with Connected App
5. Test API endpoints manually if needed

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build

# Run tests
npm test

# Clear npm cache
npm cache clean --force
```

## Environment Variables Template

Keep this for reference:

```
REACT_APP_SALESFORCE_CLIENT_ID=<Consumer Key from Connected App>
REACT_APP_SALESFORCE_CLIENT_SECRET=<Client Secret from Connected App>
REACT_APP_SALESFORCE_REDIRECT_URI=http://localhost:3000/callback
REACT_APP_SALESFORCE_AUTH_URL=https://login.salesforce.com
```

---

**Setup Complete! Happy validation rule managing! 🎉**
