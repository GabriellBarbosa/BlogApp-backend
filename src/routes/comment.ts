import { Router } from 'express';
import { CommentController } from '@controllers/CommentController';
import { handleAuth } from '@middlewares/auth';

const routes = Router();
const commentController = new CommentController();

// @desc List post comments by postId
routes.get('/list/:id', commentController.listByPost);

// @desc Adds a new comment based on postId protected route
routes
.use(handleAuth)
.post('/add/:id', commentController.add);

// @desc Edits the comment. protected route
routes
.use(handleAuth)
.put('/edit/:id', commentController.edit);

// @desc Deletes a comment. protected route
routes
  .use(handleAuth)
  .delete('/delete/:id', commentController.delete);

export { routes };