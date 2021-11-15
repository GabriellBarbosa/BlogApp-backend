import { Router } from 'express'
import { AuthController } from '@controllers/AuthController'
import { handleAuth } from '@middlewares/auth'

const routes = Router()
const authController = new AuthController()

// @desc Creates a new user
routes.post('/register', authController.createAccount)

// @desc Handles users login
routes.post('/authenticate', authController.authenticate)

// @desc Sends a email with a token to recover the password
routes.post('/lost-password', authController.lostPassword)

// @desc Changes user password
routes.post('/recover-password', authController.recoverPassword)

// @desc Returns user data by the token. protected route
routes.use(handleAuth).post('/auto-login', authController.autoLogin)

// @desc Updates user data. protected route
routes.use(handleAuth).put('/edit', authController.edit)

// @desc Deletes an user. protected route
routes.use(handleAuth).delete('/delete', authController.delete)

export { routes }
