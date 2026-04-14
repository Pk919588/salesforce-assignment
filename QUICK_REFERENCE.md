# 🚀 Quick Reference Card

## Start Here!

### Installation (5 minutes)
```bash
cd salesforce-ui
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

### Environment Variables Needed
```
REACT_APP_SALESFORCE_CLIENT_ID=your_client_id
REACT_APP_SALESFORCE_CLIENT_SECRET=your_client_secret
REACT_APP_SALESFORCE_REDIRECT_URI=http://localhost:3000/callback
REACT_APP_SALESFORCE_AUTH_URL=https://login.salesforce.com
```

---

## Essential Files

| File | Purpose |
|------|---------|
| `App.js` | Main routing component |
| `Login.js` | OAuth login screen |
| `ValidationRules.js` | Main feature |
| `Callback.js` | OAuth handler |
| `SalesforceService.js` | API layer |
| `SETUP_GUIDE.md` | Complete setup |
| `CHECKLIST.md` | Verify setup |

---

## Component Usage

### Import & Use
```javascript
import ValidationRules from './ValidationRules'
import Login from './Login'
import SalesforceService from './SalesforceService'
```

### Key Methods in SalesforceService
```javascript
SalesforceService.getLoginUrl()           // Get OAuth URL
SalesforceService.getAccessToken(code)    // Exchange code
SalesforceService.getValidationRulesTooling() // Fetch rules
SalesforceService.updateValidationRuleStatus(id, active) // Toggle
SalesforceService.deployValidationRules(rules) // Deploy
SalesforceService.logout()                // Clear tokens
```

---

## Common Tasks

### Add a Button
```javascript
<button 
  className="btn btn-primary"
  onClick={handleClick}
  disabled={isLoading}
>
  Click Me
</button>
```

### Add State
```javascript
const [data, setData] = useState([])

// Update state
setData([...data, newItem])
```

### Make API Call
```javascript
try {
  const rules = await SalesforceService.getValidationRulesTooling()
  setRules(rules)
} catch (error) {
  setError(error.message)
}
```

### Style Component
```css
.my-component {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
```

---

## Debugging

### View in Browser Console
```javascript
// Check if authenticated
console.log(localStorage.getItem('sfAccessToken'))

// View validation rules
fetch('your-url').then(r => r.json()).then(console.log)
```

### DevTools Tips
- F12 → Console: See errors
- F12 → Network: Monitor API calls
- F12 → Application: View localStorage
- React DevTools Extension: View component tree

---

## Build Commands

```bash
npm start        # Development server
npm build        # Production build
npm test         # Run tests
npm eject        # Advanced config (NO UNDO!)
```

---

## Deployment

### Heroku
```bash
heroku create app-name
heroku config:set VAR=value
git push heroku main
```

### Netlify
Push to GitHub, Netlify auto-deploys

### Azure
Use App Service and GitHub Actions

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't login | Check Client ID/Secret, Callback URL |
| Rules not showing | Verify API permissions, try refresh |
| Deploy fails | Check user has permission, try single rule |
| Token expired | Log out and back in |

---

## Resources

- [Salesforce Docs](https://developer.salesforce.com/docs)
- [React Docs](https://react.dev)
- [OAuth Guide](https://oauth.net/2/)
- [Project SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## Key Concepts

**OAuth 2.0**: Secure authentication without sharing passwords  
**Tooling API**: Query and update metadata like validation rules  
**Metadata API**: Deploy changes to Salesforce  
**Token**: Access credentials stored in localStorage  
**Refresh Token**: Used to get new access token when expired  

---

## Next Steps

1. Read: `SETUP_GUIDE.md` (20-30 min setup)
2. Create: Salesforce Developer Org
3. Create: Connected App with OAuth
4. Create: 5 Validation Rules
5. Configure: `.env` file
6. Run: `npm start`
7. Test: Login and use app
8. Deploy: To production server

---

**Happy Coding! 🎉**
