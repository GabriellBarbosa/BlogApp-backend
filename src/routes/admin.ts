import { Router } from "express";
import { CategoryController } from "@controllers/CategoryController";

const routes = Router();
const categoryController = new CategoryController();

// @desc Returns all categories
routes.get('/categories/', categoryController.listAll);

// @desc Saves a new category in MONGODB
routes.post('/categories/add', categoryController.add);

// @desc Edits a category
routes.put('/categories/edit/:id', categoryController.edit);

// @desc Deletes a category
routes.delete('/categories/delete/:id', categoryController.delete);

export { routes };