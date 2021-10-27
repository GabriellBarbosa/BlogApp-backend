import { Category } from "@models/Category";
import { Request, Response } from "express";

class CategoryController {
  add = async (req: Request, res: Response) => {
    let errs = [];
    const { name, slug } = req.body;

    if (!name || name === undefined)
      errs.push({ field: 'name', message: 'Campo obrigatório' });
    if (!slug || slug === undefined)
      errs.push({ field: 'slug', message: 'Campo obrigatório' });
    if (errs.length)
      return res.status(400).json(errs);

    try {
      const newCategory = await Category.create({ name, slug });
      return res.json(newCategory);
    } catch (err) {
      return res.status(500).json({ 
        message: `Não foi possível cadastrar a categoria: ${err}` 
      });
    }
  }
}

export { CategoryController };