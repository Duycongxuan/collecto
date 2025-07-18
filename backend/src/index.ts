import 'reflect-metadata';
import app from './app';
import { config } from './config/env';
import { AppDataSource } from './config/database';
import { logger } from './config/logger';

const PORT = config.app.port;

const startServer = async () => {
  try {
    //Initialize database connection
    await AppDataSource.initialize();
    logger.info('Database connected successfully.');

    //Start server
    app.listen(PORT, () => {
      logger.info(`Server is running on Port: ${PORT} `);
      logger.info(`Status check: http://localhost:${PORT}/status`)
    })
  } catch (error) {
    logger.error('Failed to start server: ', error);
    process.exit(1);
  }
}

startServer()