import { Request, Response } from "express";
import { Category } from "@models/Category";
import { AppError } from "@errors/AppError";

class CategoryController {
  add = async (req: Request, res: Response) => {
    let errs = [];
    const { name, slug } = req.body;

    if (!name || name === undefined)
      errs.push({ field: 'name', message: 'Campo obrigatório' });
    if (!slug || slug === undefined)
      errs.push({ field: 'slug', message: 'Campo obrigatório' });
    if (errs.length)
      throw new AppError(errs);

    const newCategory = await new Category({ name, slug }).save();
    return res.json(newCategory);
  }

  listAll = async (req: Request, res: Response) => {
    const categories = await Category.find({})
      .sort({ createdAt: 'desc' })
      .exec();
    
    return res.json(categories);
  }
}

export { CategoryController };