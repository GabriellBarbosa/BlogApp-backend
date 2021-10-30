import { Request, Response, Router } from "express";

const routes = Router();

routes.get('/', (req: Request, res: Response) => {
  res.json('Hello World');
});

export { routes };