import { Router } from 'express'
import { PostController } from '@controllers/PostController'
import { handleAuth } from '@middlewares/auth'

const routes = Router()
const postController = new PostController()

// @desc Returns all posts
routes.get('/', postController.listAll)

// @desc Returns the post by id
routes.get('/:id', postController.getById)

// @desc Returns posts by slug
routes.get('/category/:slug', postController.getByCategory)

// @desc Saves a new post. protected route
routes.use(handleAuth).post('/add', postController.add)

// @desc Updates a post. protected route
routes.use(handleAuth).put('/edit/:id', postController.edit)

// @desc Deletes a post. protected route
routes.use(handleAuth).delete('/delete/:id', postController.delete)

export { routes }
