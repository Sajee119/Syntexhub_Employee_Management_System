import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const buildUsername = (email, name) => {
  const base = (email || name || 'admin')
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '');
  return `${base || 'admin'}_${Date.now().toString(36)}`;
};

const seedAdmin = async () => {
  const User = (await import('./models/User.js')).default;
  const existing = await User.findOne({ email: 'admin@employeems.com' });
  if (!existing) {
    await User.create({
      name: 'Admin User',
      email: 'admin@employeems.com',
      username: buildUsername('admin@employeems.com', 'Admin User'),
      password: 'qwerty123',
      role: 'Admin'
    });
    console.log('Admin user seeded!');
  } else {
    console.log('Admin already exists');
  }
  mongoose.connection.close();
};

seedAdmin().catch(console.error);
