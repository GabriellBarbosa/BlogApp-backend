import { Router } from "express";
import { CategoryController } from "@controllers/CategoryController";

const routes = Router();
const categoryController = new CategoryController();

// @desc Returns all categories in MONGODB
routes.get('/categories/', categoryController.listAll);

// @desc Saves a new category in MONGODB
routes.post('/categories/add', categoryController.add);

export { routes };