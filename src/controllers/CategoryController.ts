import { Request, Response } from "express";
import { Category } from "@models/Category";
import { AppError } from "@errors/AppError";
import { User } from "@models/User";

class CategoryController {

  listAll = async (req: Request, res: Response) => {
    const categories = await Category.find({})
      .sort({ createdAt: 'desc' })
      .exec();

    return res.json(categories);
  }

  add = async (req: Request, res: Response) => {
    if (!req.userId) throw new AppError('Não autorizado', 401);

    const user = await User.findOne({ _id: req.userId }).exec();

    if (!user || user.isAdmin !== 1) 
      throw new AppError('Não autorizado', 401);

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

  edit = async (req: Request, res: Response) => {
    if (!req.userId) throw new AppError('Não autorizado', 401);

    const user = await User.findOne({ _id: req.userId }).exec();

    if (!user || user.isAdmin !== 1) 
      throw new AppError('Não autorizado', 401);

    const { id } = req.params;
    const { name, slug } = req.body;
    let edits = 0;

    const category = await Category.findOne({ _id: id }).exec();
    
    if (!category) 
      throw new AppError('Categoria não encontrada', 404);
    if (!name && !slug) 
      throw new AppError('Impossível atualizar');

    if (String(name).trim() && name !== undefined) {
      category.name = name;
      edits += 1;
    }
    if (String(slug).trim() && slug !== undefined) {
      category.slug = slug;
      edits += 1;
    }
    if (!edits) throw new AppError('Impossível atualizar');

    category.updatedAt = new Date();
    await category.save();

    return res.json(category);
  }

  delete = async (req: Request, res: Response) => {
    if (!req.userId) throw new AppError('Não autorizado', 401);

    const user = await User.findOne({ _id: req.userId }).exec();

    if (!user || user.isAdmin !== 1) 
      throw new AppError('Não autorizado', 401);

    const { id } = req.params;
    await Category.deleteOne({ _id: id }).exec();

    return res.json({ message: 'Categoria removida' });
  }
}

export { CategoryController };