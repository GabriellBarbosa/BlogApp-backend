import { Router } from 'express';
import { CommentController } from '@controllers/CommentController';
import { handleAuth } from '@middlewares/auth';

const routes = Router();
const commentController = new CommentController();

// @desc Adds a new comment to a post. protected route
routes
.use(handleAuth)
.post('/add/:id', commentController.add);

export { routes };