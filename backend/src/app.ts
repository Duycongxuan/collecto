import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

//Security middleware
app.use(helmet());
app.use(cors())

//Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15m
  max: 100, //Limit each IP to 100 request per windows
  message: 'Too many request from this IP, please try again.'
});

app.use(limiter);

//Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//Error handle middleware
app.use(errorHandler);

//Routes

//Routes check
app.get('/status', (req, res) => {
  res.status(200).json({
    status: 'success',
    code: 200,
    message: 'OK',
    timeStamp: new Date().toISOString()
  })
})

//404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    timestamps: new Date()
  })
});

export default app;