import express from 'express';

const app = express();

// Express config
  app.use(express.json());
  
export { app };