import { Router } from 'express'
import { CategoryController } from '@controllers/CategoryController'
import { handleAuth } from '@middlewares/auth'

const routes = Router()
const categoryController = new CategoryController()

// @desc Returns all categories
routes.get('/categories/', categoryController.listAll)

// @desc Saves a new category in MONGODB. protected route
routes.use(handleAuth).post('/categories/add', categoryController.add)

// @desc Edits a category. protected route
routes.use(handleAuth).put('/categories/edit/:id', categoryController.edit)

// @desc Deletes a category. protected route
routes
  .use(handleAuth)
  .delete('/categories/delete/:id', categoryController.delete)

export { routes }
