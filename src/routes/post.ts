import { Router } from 'express';
import { PostController } from '@controllers/PostController';

const routes = Router();
const postController = new PostController();

// @desc Add a new post
routes.post('/add', postController.add);

export { routes };