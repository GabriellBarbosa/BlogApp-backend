import { Post } from "@models/Post";
import { Category } from "@models/Category";
import { Request, Response } from "express";
import { AppError } from '@errors/AppError';

class PostController {
  add = async (req: Request, res: Response) => {
    const { content, slug, category } = req.body;
    let errs = [];

    if (!content || content === undefined)
      errs.push({ field: 'content', message: 'Campo obrigatório' });
    if (!slug || slug === undefined)
      errs.push({ field: 'slug', message: 'Campo obrigatório' });
    if (!category || category === undefined)
      errs.push({ field: 'category', message: 'Campo obrigatório' });
    if (errs.length)
      throw new AppError(errs);

    // if not category, returns a server error;
    await Category.findOne({ _id: category }).exec();
    const newPost = new Post({ content, slug, category });
    const post = await newPost.save();
    
    return res.json(post);
  }
}

export { PostController };