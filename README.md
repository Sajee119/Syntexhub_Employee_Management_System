# Employee Management System (EMS)

A full-stack MERN application for managing employee data with modern UI/UX.

## Features

### Core Functionality
- Complete CRUD operations for employees
- Dashboard with summary statistics
- Search, filter, and pagination
- Dark mode toggle
- CSV export
- Toast notifications
- Responsive design

### Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide React, React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Auth**: JWT-based authentication
- **HTTP**: Axios

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
2. Install server dependencies:
   ```bash
   cd server && npm install
   ```

3. Install client dependencies:
   ```bash
   cd client && npm install
   ```

4. Configure environment variables in `server/.env`:
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/employee_management
   JWT_SECRET=your_jwt_secret
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   CLIENT_URL=http://localhost:5173
   ```

### Seed Default Admin

Run this in MongoDB shell or create a seed script:
```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@employeems.com",
  password: "$2a$10$hashed_password", // Use bcrypt to hash "qwerty123"
  role: "Admin"
})
```

Or manually create the user via the app after setting up the backend.

### Running the App

1. Start MongoDB (if local):
   ```bash
   mongod
   ```

2. Start backend server:
   ```bash
   cd server && npm run dev
   ```

3. Start frontend:
   ```bash
   cd client && npm run dev
   ```

4. Open http://localhost:5173

### Default Login
- **Email**: admin@employeems.com
- **Password**: qwerty123

## Folder Structure

```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── layouts/
│   │   └── context/
├── server/          # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── config/
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile | Get user profile |
| GET | /api/employees | Get all employees (with pagination, search, filter) |
| POST | /api/employees | Create employee |
| PUT | /api/employees/:id | Update employee |
| DELETE | /api/employees/:id | Delete employee |

## License

MIT
