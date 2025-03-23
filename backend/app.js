import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import statusMonitor from "express-status-monitor";

import { apiLimiter } from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';
import httpLogger from "./middleware/loggerMiddleware.js"; 
import metricsMiddleware from "./middleware/metricsMiddleware.js";

import authRoutes from './routes/authRoutes.js';
import contestRoutes from './routes/contestRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import questionRoutes from './routes/questionRoutes.js';

const app = express();

const corsOptions = {
  origin: ["http://localhost:5174", process.env.FRONTEND_URL], // Allow only your frontend
  methods: "GET,POST,PUT,DELETE",
  credentials: true
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(metricsMiddleware);
app.use(httpLogger); // Logs all HTTP requests
app.use(
  statusMonitor({
    path: "/monitor", // Change default path (/status)
    spans: [
      { interval: 1, retention: 60 }, // 1 second updates, keep for 60 sec
      { interval: 5, retention: 60 }, // 5 sec updates, keep for 60 sec
      { interval: 15, retention: 60 } // 15 sec updates, keep for 60 sec
    ],
    chartVisibility: {
      cpu: true,
      mem: true,
      load: true,
      responseTime: true,
      rps: true,
      statusCodes: true
    }
  })
);


// Configure Helmet but allow Swagger UI
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Rate limiting
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all route handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

export default app;
