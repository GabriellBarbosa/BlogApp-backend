import express from 'express';
import env from 'dotenv';
import { routes as admin } from '@routes/admin';

env.config();
const app = express();

// Express config
  app.use(express.json());

// Routes
  app.use('/admin', admin);

export { app };