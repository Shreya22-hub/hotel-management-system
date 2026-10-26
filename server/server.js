import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seedDatabase.js';
import { securityHeaders } from './middleware/securityMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import billRoutes from './routes/billRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import logRoutes from './routes/logRoutes.js';
import seedRoutes from './routes/seedRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. Native HTTP Security Headers
app.use(securityHeaders);

// 2. Strict CORS Lockdown (Only allows trusted client URL)
app.use(cors({
  origin: CLIENT_URL,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// 3. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/seed', seedRoutes);

// Health check endpoint (Public)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    server: 'Rajvilas Heritage Palace PMS Backend',
    database: 'MongoDB',
    security: 'Native Zero-Install HMAC + Salted Scrypt + RBAC Active',
    timestamp: new Date().toISOString()
  });
});

// Start Server & Connect Database
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase(false);

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🏰 Rajvilas Heritage Palace — Backend API Online!`);
      console.log(`🚀 Port: http://localhost:${PORT}`);
      console.log(`🌿 Database: MongoDB (Mongoose Connected)`);
      console.log(`🔒 Security: Native Zero-Install Scrypt + HMAC + RBAC + CORS`);
      console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
