import { Info, Mail, Globe, Github, Users, Shield, Database, Zap, Layout, Bell, Settings, FileText, Code, Heart, Copyright, Phone, Linkedin, Twitter, Briefcase } from 'lucide-react';
import developerProfile from '../assets/developer-profile.png';

export default function About() {
  const currentYear = new Date().getFullYear();

  const features = [
    { icon: Users, title: 'Employee Management', description: 'Add, edit, and manage employee records with ease' },
    { icon: Shield, title: 'Role-Based Access', description: 'Secure authentication with admin and user roles' },
    { icon: Database, title: 'Data Persistence', description: 'Reliable MongoDB database for all employee data' },
    { icon: Zap, title: 'Real-Time Updates', description: 'Instant notifications and live data synchronization' },
    { icon: Layout, title: 'Responsive Design', description: 'Modern UI that works on desktop, tablet, and mobile' },
    { icon: Bell, title: 'Smart Notifications', description: 'Toast notifications for all important actions' },
    { icon: Settings, title: 'Customizable', description: 'Flexible settings and configuration options' },
    { icon: FileText, title: 'Detailed Reports', description: 'View comprehensive employee information' }
  ];

  const techStack = [
    { category: 'Frontend', items: ['React 18.2', 'Vite 5.0', 'Tailwind CSS 3.3', 'React Router 6.2', 'Lucide Icons'] },
    { category: 'Backend', items: ['Node.js', 'Express.js', 'JWT Authentication', 'BCrypt Encryption', 'Axios'] },
    { category: 'Database', items: ['MongoDB', 'Mongoose ODM', 'Indexed Queries', 'Schema Validation'] },
    { category: 'Tools', items: ['ESLint', 'PostCSS', 'Git', 'Nodemon', 'React Hot Toast'] }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Info /> About</h1>
      <div className="card max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary-600 mb-2">Employee Management System</h2>
          <p className="text-secondary-500">Version 1.0.0</p>
          <p className="text-sm text-secondary-400 mt-2">Built with modern web technologies</p>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-secondary-600 dark:text-secondary-400 text-center max-w-2xl mx-auto">
            A full-stack MERN application designed to streamline employee data management with a modern, intuitive interface and powerful backend.
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><Zap size={20} /> Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <feature.icon className="text-primary-600" size={20} />
                </div>
                <div>
                  <p className="font-semibold">{feature.title}</p>
                  <p className="text-sm text-secondary-500 mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><Code size={20} /> Technology Stack</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {techStack.map((tech, index) => (
              <div key={index} className="p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
                <p className="text-sm font-semibold text-primary-600 mb-3">{tech.category}</p>
                <ul className="space-y-1.5">
                  {tech.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-secondary-600 dark:text-secondary-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4">System Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary-600">100%</p>
              <p className="text-sm text-secondary-500">Responsive</p>
            </div>
            <div className="p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary-600">MERN</p>
              <p className="text-sm text-secondary-500">Full Stack</p>
            </div>
            <div className="p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary-600">JWT</p>
              <p className="text-sm text-secondary-500">Secure Auth</p>
            </div>
            <div className="p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary-600">Real-time</p>
              <p className="text-sm text-secondary-500">Notifications</p>
            </div>
          </div>
        </div>

        <div className="mb-10 bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
              <Code className="text-indigo-500" size={24} />
              Developer
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <div className="w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <img
                    src={developerProfile}
                    alt="Sivanadarajah Sajeepan - Developer Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Sivanadarajah Sajeepan</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-1">Software Engineer</p>
                <p className="text-secondary-500 mb-4">Full Stack Developer</p>
                <p className="text-secondary-600 dark:text-secondary-300 mb-6 leading-relaxed">
                  Sajeepan is a passionate full stack developer with expertise in building modern web applications.
                  With a strong background in JavaScript, React, and Node.js, Sajeepan is dedicated to creating seamless
                  user experiences and efficient code. When not coding, Sajeepan enjoys hiking and exploring new technologies.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="flex items-center gap-3 text-sm">
                    <Mail className="text-indigo-500" size={16} />
                    <span className="text-secondary-600 dark:text-secondary-300">Sajeepan634@gmail.com</span>
                  </p>
                  <p className="flex items-center gap-3 text-sm">
                    <Phone className="text-indigo-500" size={16} />
                    <span className="text-secondary-600 dark:text-secondary-300">+94783566823</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.linkedin.com/in/sivanadaraja-sajeepan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
                  >
                    <Linkedin size={16} /> LinkedIn
                  </a>
                  <a
                    href="https://github.com/Sajee119"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition text-sm font-medium"
                  >
                    <Github size={16} /> GitHub
                  </a>
                  <a
                    href="https://x.com/SSajeepan3492"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition text-sm font-medium"
                  >
                    <Twitter size={16} /> X
                  </a>
                  <a
                    href="mailto:Sajeepan634@gmail.com"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm font-medium"
                  >
                    <Mail size={16} /> Email
                  </a>
                  <a
                    href="https://sajeepan-portfolio.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm font-medium"
                  >
                    <Briefcase size={16} /> Portfolio
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-200 dark:border-secondary-700 pt-6">
          <h3 className="font-semibold mb-4">Contact & Links</h3>
          <div className="space-y-3">
            <a href="mailto:admin@employeems.com" className="flex items-center gap-3 text-secondary-600 hover:text-primary-600 transition-colors">
              <Mail size={16} /> admin@employeems.com
            </a>
            <a href="#" className="flex items-center gap-3 text-secondary-600 hover:text-primary-600 transition-colors">
              <Globe size={16} /> www.employeems.com
            </a>
            <a href="#" className="flex items-center gap-3 text-secondary-600 hover:text-primary-600 transition-colors">
              <Github size={16} /> github.com/employeems
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-secondary-200 dark:border-secondary-700 text-center">
          <p className="text-sm text-secondary-400 flex items-center justify-center gap-1">
            <Copyright size={14} /> {currentYear} Employee Management System. Made with <Heart size={14} className="text-red-500" /> using the MERN stack.
          </p>
        </div>
      </div>
    </div>
  );
}
