import { Router } from "express";
import { CategoryController } from "@controllers/CategoryController";

const routes = Router();
const categoryController = new CategoryController();

// @desc Returns all categories
routes.get('/categories/', categoryController.listAll);

// @desc Saves a new category in MONGODB
routes.post('/categories/add', categoryController.add);

// @desc Updates categories
routes.put('/categories/update/:id', categoryController.update);

export { routes };