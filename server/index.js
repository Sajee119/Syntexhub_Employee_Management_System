import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import employeeRoutes from './routes/employeeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import transferRoutes from './routes/transferRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import path from 'path';
import fs from 'fs';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();
connectDB();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL, credentials: true }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('join', (userId) => { socket.join(userId); });
  socket.on('disconnect', () => console.log('Client disconnected'));
});

app.set('io', io);

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/announcements', announcementRoutes);


app.use(notFound);
app.use(errorHandler);

const tryListen = (port) => {
  port = Number(port);
  const server = httpServer.listen(port, () => console.log(`Server running on port ${port}`));
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Free the port or set a different PORT environment variable and restart.`);
      process.exit(1);
    } else {
      console.error(err);
      process.exit(1);
    }
  });
};

tryListen(PORT);
