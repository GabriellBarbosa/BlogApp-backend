import { Router } from "express";
import { AuthController } from "@controllers/AuthController";

const routes = Router();
const authController = new AuthController();

// @desc Creates a new user
routes.post('/register', authController.createAccount);

// @desc Handles users login
routes.post('/authenticate', authController.authenticate);

export { routes };