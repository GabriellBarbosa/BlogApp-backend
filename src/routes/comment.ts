import { Router } from 'express';
import { CommentController } from '@controllers/CommentController';
import { handleAuth } from '@middlewares/auth';

const routes = Router();
const commentController = new CommentController();

// @desc List post comments by postId
routes.get('/list/:id', commentController.listByPost);

// @desc Adds a new comment to a post. protected route
routes
.use(handleAuth)
.post('/add/:id', commentController.add);

export { routes };