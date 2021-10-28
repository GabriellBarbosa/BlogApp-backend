import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import env from 'dotenv';
import { createConnection } from '@database/index';
import { routes as admin } from '@routes/admin';
import { AppError } from '@errors/AppError';

env.config();
createConnection();
const app = express();

// Express config
  app.use(express.json());

// Routes
  app.use('/admin', admin);

// Handle app errors
  app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    if(err instanceof AppError) {
      return res.status(err.statusCode).json({
        message: err.message
      });
    }

    return res.status(500).json({
      status: 'Error',
      message: `Internal server error: ${err.message}`
    });
  });

export { app };