import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error.middleware';
import router from './routes/index.route';
import path from 'path';

const app = express();

// Security middleware for HTTP headers
app.use(helmet());
// Enable Cross-Origin Resource Sharing
app.use(cors())

// Use cookie-parser middleware to read cookies from requests
app.use(cookieParser());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Serve ảnh tạm
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Main API routes
app.use('/api/v1', router);

// Health check endpoint
app.get('/status', (req, res) => {
  res.status(200).json({
    status: 'success',
    code: 200,
    message: 'OK',
    timeStamp: new Date().toISOString()
  })
})

// 404 Handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    timestamps: new Date()
  })
});

// Global error handler middleware
app.use(errorHandler);

export default app;