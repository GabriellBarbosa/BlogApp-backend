import { Router } from 'express';
import { PostController } from '@controllers/PostController';

const routes = Router();
const postController = new PostController();

// @desc Returns all posts
routes.get('/', postController.listAll);

// @desc Saves a new post
routes.post('/add', postController.add);

// @desc Updates a post
routes.put('/update/:id', postController.update);

export { routes };