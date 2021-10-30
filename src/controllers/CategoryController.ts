import { Request, Response } from "express";
import { Category } from "@models/Category";
import { AppError } from "@errors/AppError";

class CategoryController {
  add = async (req: Request, res: Response) => {
    let errs = [];
    const { name, slug } = req.body;

    if (!String(name).trim() || name === undefined)
      errs.push({ field: 'name', message: 'Campo obrigatório' });
    if (!String(slug).trim() || slug === undefined)
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

  edit = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, slug } = req.body;

    const category = await Category.findOne({ _id: id }).exec();
    
    if(!category)
      throw new AppError('Categoria não encontrada', 404);
    if (!name && !slug)
      throw new AppError('Impossível atualizar');
    if (name || name !== undefined)
      category.name = name;
    if (slug || slug !== undefined)
      category.slug = slug;

    category.updatedAt = new Date();
    await category.save();

    return res.json(category);
  }

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    await Category.remove({ _id: id }).exec();

    return res.json({ message: 'Categoria removida' });
  }
}

export { CategoryController };