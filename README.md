# Employee Management System (EMS)

> A comprehensive full-stack MERN application for managing employee data with modern UI/UX, real-time notifications, and advanced features including 2FA authentication, attendance tracking, salary management, and document handling.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18%2B-blue)](https://react.dev/)

## 📋 Project Overview

The Employee Management System (EMS) is an enterprise-grade application designed to streamline HR operations and employee lifecycle management. It provides a robust platform for HR teams and administrators to efficiently manage employee records, attendance, salaries, departments, roles, and internal communications. The system features a modern, intuitive interface with real-time notifications, comprehensive reporting capabilities, and advanced security measures.

### Key Highlights
- **Complete Employee Lifecycle Management**: Hire, manage, and track employees
- **Two-Factor Authentication (2FA)**: Enhanced security with TOTP-based 2FA
- **Attendance Tracking**: Real-time attendance marking with monthly analytics
- **Salary Management**: Automated salary slip generation and management
- **Department & Role Management**: Organize teams with hierarchical structure
- **Document Management**: Upload, store, and manage employee documents
- **Email Notifications**: Automated notifications via SMTP
- **Real-time Updates**: Socket.IO for live notifications and updates
- **Responsive Design**: Mobile-friendly UI with dark mode support

### Topics
`employee-management` `MERN` `React` `Node.js` `Express.js` `MongoDB` `JWT` `2FA` `HR-Management` `Full-Stack` `REST-API` `Socket.io` `Tailwind-CSS` `Mongoose` `Vite`

## ✨ Features

### 👥 Employee Management
- **CRUD Operations**: Create, read, update, and delete employee records
- **Advanced Search & Filter**: Search by name, email, department, role, status
- **Pagination**: Efficient data loading with configurable page sizes
- **Bulk Actions**: Export employee data to CSV
- **Profile Management**: Upload and manage employee profile pictures
- **Status Tracking**: Track employee status (Active, Inactive, On Leave)

### 🔐 Authentication & Security
- **JWT-based Authentication**: Secure token-based API access
- **Two-Factor Authentication (2FA)**: TOTP-based 2FA for enhanced security
- **Password Encryption**: Bcrypt password hashing
- **Role-Based Access Control**: Admin, Manager, and Employee roles
- **Session Management**: Persistent login with secure cookie handling

### 📊 Attendance Management
- **Real-time Attendance Marking**: Quick-mark attendance status
- **Attendance History**: View monthly attendance records
- **Attendance Analytics**: Visual charts and trends
- **Status Types**: Present, Absent, Late, Half Day tracking
- **Monthly Reports**: Comprehensive attendance reports by employee

### 💰 Salary Management
- **Salary Slip Generation**: Automated salary slip creation
- **Deduction Calculation**: Configurable deductions (10% default)
- **Net Pay Calculation**: Automatic net pay computation
- **Print & Export**: Print or download salary slips
- **Salary Records**: Maintain salary history

### 📋 Document Management
- **Document Upload**: Upload and organize employee documents
- **Multiple Document Types**: ID, Certificate, Contract, Payslip, Other
- **File Management**: Download and delete documents
- **Timestamp Tracking**: Auto-generated upload timestamps
- **Secure Storage**: Server-side file storage with validation

### 🏢 Organizational Structure
- **Department Management**: Create and manage departments
- **Role Management**: Define roles and permissions
- **Admin Management**: Add, edit, delete administrators
- **User Account Management**: Manage user accounts and profiles
- **Activity Logging**: Track administrative actions

### 📢 Communications
- **Email Notifications**: Send emails to employees
- **Real-time Notifications**: Socket.IO-powered live notifications
- **Notification Bell**: Unread notification counter
- **Announcement System**: Post announcements to employees

### 🎨 User Experience
- **Dark Mode**: Theme toggle for comfortable viewing
- **Responsive Design**: Works seamlessly on desktop, tablet, mobile
- **Toast Notifications**: User-friendly feedback messages
- **Loading States**: Smooth loading indicators
- **Error Handling**: Comprehensive error messages and network error detection
- **Modern UI**: Built with Tailwind CSS and Lucide React icons

## 💻 Tech Stack

### Frontend
- **React 18+** - UI library
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **js-cookie** - Cookie management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Token-based authentication
- **Bcryptjs** - Password hashing
- **Nodemailer** - Email sending
- **Socket.IO** - Real-time communication
- **Multer** - File upload handling
- **Dotenv** - Environment variable management

### Tools & Services
- **MongoDB Atlas** - Cloud database hosting
- **Gmail SMTP** - Email service
- **ES Modules (ESM)** - Modern JavaScript modules

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

## 📁 Folder Structure

```
Employee-Management-System/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── BackendWarmupGate.jsx
│   │   │   ├── DeleteConfirmationModal.jsx
│   │   │   ├── EmailConfirmationModal.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   └── ...
│   │   ├── pages/                   # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EmployeeManagement.jsx
│   │   │   ├── EmployeeDetail.jsx
│   │   │   ├── AdminManagement.jsx
│   │   │   ├── DepartmentManagement.jsx
│   │   │   ├── RoleManagement.jsx
│   │   │   ├── Login.jsx
│   │   │   └── ...
│   │   ├── services/                # API service calls
│   │   │   ├── api.js               # Axios instance
│   │   │   ├── employeeService.js
│   │   │   ├── documentService.js
│   │   │   ├── notificationService.js
│   │   │   └── ...
│   │   ├── context/                 # React context
│   │   │   └── AuthContext.jsx      # Authentication context
│   │   ├── layouts/                 # Layout components
│   │   │   └── Layout.jsx
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env                         # Environment variables
│
├── server/                          # Express backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/                 # Route handlers
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── documentController.js
│   │   ├── notificationController.js
│   │   └── ...
│   ├── models/                      # MongoDB schemas
│   │   ├── User.js
│   │   ├── Employee.js
│   │   ├── Document.js
│   │   ├── Notification.js
│   │   ├── ActivityLog.js
│   │   └── ...
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   ├── documentRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── ...
│   ├── middleware/                  # Express middleware
│   │   └── errorHandler.js
│   ├── services/                    # Business logic
│   │   ├── emailService.js          # Email sending
│   │   └── ...
│   ├── uploads/                     # File storage
│   ├── index.js                     # Server entry point
│   ├── seed.js                      # Database seeding
│   ├── package.json
│   └── .env                         # Environment variables
│
├── .gitignore
├── README.md
└── LICENSE
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

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- **MongoDB Atlas** account (or local MongoDB)
- **Gmail account** (for SMTP configuration)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Employee-Management-System.git
cd Employee-Management-System
```

#### 2. Server Setup
```bash
cd server
npm install
```

Create `.env` file in the server directory (copy from `.env.example`):
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
CLIENT_URL=http://localhost:5173
SECRETKEY=your-2fa-secret-key
```

#### 3. Client Setup
```bash
cd ../client
npm install
```

Create `.env` file in the client directory (copy from `.env.example`):
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Employee Management System
```

#### 4. Database Seeding (Optional)
To seed the database with default admin user:
```bash
cd server
node seed.js
```

### Running the Application

#### Terminal 1 - Backend Server
```bash
cd server
npm run dev
```
Server runs on: `http://localhost:5000`

#### Terminal 2 - Frontend Development Server
```bash
cd client
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Default Admin Credentials
- **Email**: `admin@employeems.com`
- **Password**: `qwerty123`
- **2FA Passkey**: `196629`

### Build for Production

#### Build Frontend
```bash
cd client
npm run build
```
Output: `client/dist/`

#### Run Server in Production
```bash
cd server
npm start
```

## 📖 API Documentation

### Authentication
- **POST** `/api/auth/login` - Login with email and password
- **POST** `/api/auth/verify-2fa` - Verify 2FA code
- **GET** `/api/auth/profile` - Get authenticated user profile (requires JWT)
- **POST** `/api/auth/logout` - Logout user

### Employees
- **GET** `/api/employees` - Get all employees (pagination, search, filter)
- **GET** `/api/employees/:id` - Get employee details
- **POST** `/api/employees` - Create new employee (Admin only)
- **PUT** `/api/employees/:id` - Update employee (Admin only)
- **DELETE** `/api/employees/:id` - Delete employee (Admin only)

### Attendance
- **POST** `/api/attendance/mark` - Mark attendance
- **GET** `/api/attendance/:employeeId` - Get attendance records
- **GET** `/api/attendance/report/:employeeId` - Get attendance report

### Documents
- **POST** `/api/documents/upload/:employeeId` - Upload document
- **GET** `/api/documents/:employeeId` - Get employee documents
- **DELETE** `/api/documents/:docId` - Delete document
- **POST** `/api/documents/salary-slip` - Generate salary slip

### Departments
- **GET** `/api/departments` - Get all departments
- **POST** `/api/departments` - Create department (Admin only)
- **PUT** `/api/departments/:id` - Update department (Admin only)
- **DELETE** `/api/departments/:id` - Delete department (Admin only)

### Roles
- **GET** `/api/roles` - Get all roles
- **POST** `/api/roles` - Create role (Admin only)
- **PUT** `/api/roles/:id` - Update role (Admin only)
- **DELETE** `/api/roles/:id` - Delete role (Admin only)

### Notifications
- **GET** `/api/notifications` - Get user notifications
- **POST** `/api/notifications/mark-read` - Mark notifications as read
- **DELETE** `/api/notifications/:id` - Delete notification

## 🔧 Troubleshooting

### Backend Won't Start
- Check if port 5000 is available: `netstat -an | grep 5000`
- Verify MongoDB connection string in `.env`
- Ensure all dependencies are installed: `npm install`
- Check server logs for error messages

### Frontend Won't Connect to Backend
- Verify backend is running on port 5000
- Check `VITE_API_URL` in client `.env`
- Clear browser cache and cookies
- Check browser console for CORS errors

### Email Notifications Not Working
- Verify Gmail SMTP credentials in `.env`
- Enable "Less secure app access" for Gmail (if using basic auth)
- Use App Passwords for Gmail if 2FA is enabled
- Check SMTP settings: Host=`smtp.gmail.com`, Port=`587`

### Database Connection Issues
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas settings
- Ensure network connectivity to MongoDB Atlas
- Test connection with MongoDB Compass

### 2FA Not Working
- Verify `SECRETKEY` matches in backend `.env`
- Ensure system time is synchronized (TOTP requires accurate time)
- Check 2FA code generation method

## 📝 Environment Variables Reference

### Server (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP user email | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP password/app password | `app-password` |
| `CLIENT_URL` | Frontend URL | `http://localhost:5173` |
| `SECRETKEY` | 2FA secret key | `196629` |

### Client (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |
| `VITE_APP_NAME` | Application name | `Employee Management System` |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Style
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure all tests pass before submitting PR

## 📄 License

MIT
