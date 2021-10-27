import { Router } from "express";
import { CategoryController } from "@controllers/CategoryController";

const routes = Router();
const categoryController = new CategoryController();

routes.post('/categories/add', categoryController.add);

export { routes };