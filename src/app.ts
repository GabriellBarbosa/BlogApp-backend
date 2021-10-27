import express from 'express';
import '@controllers/CategoryController';

const app = express();

// Express config
  app.use(express.json());
  
export { app };