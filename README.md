## Salesforce Validation Rules Manager
📌 Project Overview

This is a full-stack web application built to manage Salesforce-like validation rules. It allows users to perform CRUD operations (Create, Read, Update, Delete) on validation rules through a clean and interactive UI.

The project uses a React frontend and a Node.js/Express backend.
⚠️ Important Authentication Note

👉 This project currently uses a login bypass mechanism due to development and deadline constraints.

Authentication is simplified for demo purposes only
Full OAuth-based login (Salesforce, Google, GitHub) is integrated conceptually and can be extended in future updates
The main focus of this submission is the validation rules management system and UI functionality
🛠️ Tech Stack
Frontend:
React.js
React Router DOM
Axios
CSS / Bootstrap
Backend:
Node.js
Express.js
REST APIs

⚙️ Features
📊 Validation Rules Management
Create new validation rules
View all rules
Edit existing rules
Activate / Deactivate rules
Delete rules

🔐 Authentication Flow (Simplified)
Login screen uses bypass authentication for development
On login click, user is redirected to dashboard
Logout clears local storage and redirects to login page

📌 Future Improvements
Full OAuth authentication (Google, GitHub, Salesforce)
JWT-based secure login system
Database integration (MongoDB / PostgreSQL)
Role-based access control

### Live Links

Frontend:
https://salesforce-assignment-ql1qqgxvy-pk919588s-projects.vercel.app

Backend:
https://salesforce-assignment.onrender.com

API:
https://salesforce-assignment.onrender.com/api/rules

---

### Features
- View validation rules
- Toggle rule status
- REST API integration

---

### Tech Stack
React, Node.js, Express, Render, Vercel
# Salesforce UI

This project now uses:

- A React frontend on `http://localhost:3000`
- A Node/Express backend on `https://salesforce-assignment.onrender.com`

## Local Development

Install dependencies:

```bash
npm install
```

Start the backend in one terminal:

```bash
npm run server
```

Start the React app in a second terminal:

```bash
npm start
```

During development, the React dev server forwards `/api/salesforce/*` requests
to the backend on port `5000`.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



# 🚀 Salesforce UI Dashboard (Full-Stack Integration Project)

## 📌 Overview

This is a full-stack web application that integrates a React frontend with a Node.js/Express backend and connects to Salesforce using OAuth 2.0 authentication.

The project demonstrates real-world enterprise integration where a web application securely communicates with Salesforce APIs to authenticate users and fetch/manage Salesforce data through a backend service layer.

---

## 🎯 Key Highlights

* 🔐 Salesforce OAuth 2.0 Authentication
* 🌐 Full-stack integration (React + Node.js + Salesforce API)
* 📊 Dashboard-based UI for data visualization
* ⚡ REST API communication between frontend and backend
* 🔄 Real-time data fetching and UI updates
* 🧩 Clean and scalable project architecture

---

## ⚙️ Tech Stack

### Frontend

* React.js (Create React App)
* JavaScript (ES6+)
* Axios (API calls)
* HTML5 / CSS3

### Backend

* Node.js
* Express.js
* RESTful APIs
* Salesforce REST API Integration

### Tools & Services

* Git & GitHub (Version Control)
* Salesforce Developer Org
* OAuth 2.0 Connected App

---

## 🏗️ System Architecture

```
[ React Frontend ]
        ↓ (Axios API Requests)
[ Node.js / Express Backend ]
        ↓ (OAuth 2.0 + Salesforce REST API)
[ Salesforce Platform ]
```

---

## ✨ Features

### 🔐 Authentication

* Secure Salesforce OAuth 2.0 login flow
* Token-based authentication handling

### 📊 Data Operations

* Fetch Salesforce data via REST APIs
* Display validation rules and related information

### ⚙️ Backend Services

* Acts as middleware between frontend and Salesforce
* Handles authentication, API requests, and responses

### 🖥️ Frontend UI

* Responsive and user-friendly dashboard
* Dynamic updates after API calls
* Clean component-based structure

---

## 📁 Project Structure

```
salesforce-assignment/
│
├── frontend/              # React frontend application
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/               # Node.js backend server
│   ├── routes/
│   ├── controllers/
│   ├── server.js
│   └── package.json
│
├── README.md              # Project documentation
```

---

## 🚀 How to Run Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Pk919588/salesforce-assignment.git
cd salesforce-assignment
```

---

### 2️⃣ Install Dependencies

#### Backend

```bash
cd backend
npm install
node server.js
```

Backend will run on:

```
http://localhost:5000
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend will run on:

```
http://localhost:3000
```

---

## 🔗 Salesforce Configuration

To run this project, configure a Salesforce Connected App:

* Create a Salesforce Developer Account
* Enable OAuth Settings in Connected App
* Set Callback URL:

  ```
  http://localhost:3000
  ```
* Required OAuth Scopes:

  * Full Access (`full`)
  * API Access (`api`)
* Add Client ID and Client Secret in backend environment variables

---

## 📸 UI Overview

The application provides a complete dashboard experience including:

* 🔐 Salesforce OAuth Login Screen
* 📊 Data Dashboard for Salesforce records
* 📄 Validation rules management interface
* ⚡ Seamless backend-to-Salesforce communication

---

## 🚀 Future Improvements

* 🌍 Deploy frontend on Vercel
* 🚀 Deploy backend on Render / AWS
* 🔐 Add role-based authentication
* 📊 Improve dashboard analytics UI
* 🧾 Extend CRUD operations for Salesforce objects

---

## 👨‍💻 Author

**Pradeep Kumar**
GitHub: [https://github.com/Pk919588](https://github.com/Pk919588)

---

## ⭐ Support

If you like this project, please give it a ⭐ on GitHub.

---

## 🧠 Senior Developer Note

This project demonstrates:

* Clean separation of frontend and backend concerns
* Industry-standard OAuth 2.0 authentication flow
* Scalable REST API architecture
* Real-world Salesforce integration pattern used in enterprise systems

