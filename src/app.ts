import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import flash from 'connect-flash';

const app = express();

// Express session
  app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true
  }));
  app.use(flash());

// Middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
  });

// Express config
  app.use(express.json());
  
export { app };