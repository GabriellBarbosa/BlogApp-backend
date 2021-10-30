import { Router } from "express";
import { UserController } from "@controllers/UserController";

const routes = Router();
const userController = new UserController();

// @ Creates a new user
routes.post('/register', userController.createAccount);

export { routes };