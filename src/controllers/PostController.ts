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

    const categoryExists = await Category.findOne({ _id: category }).exec();
    if (!categoryExists) throw new AppError('Categoria inválida');

    const newPost = new Post({ content, slug, category });
    const post = await newPost.save();
    
    return res.json(post);
  }

  listAll = async (req: Request, res: Response) => {
    const posts = await Post
      .find()
      .populate('category')
      .sort({ createdAt: 'desc' });
    
    return res.json(posts);
  }

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { content, slug, category } = req.body;
    const post = await Post.findOne({ _id: id }).exec();

    if (!post)
      throw new AppError('Postagem não encontrada', 404);
    if (!content && !slug && !category)
      throw new AppError('Impossível atualizar');
    if (content)
      post.content = content;
    if (slug)
      post.slug = slug;
    if (category) {
      const categoryExists = await Category.findOne({ _id: category }).exec();
      if (!categoryExists) throw new AppError('Categoria inválida');
      post.category = category;
    }

    post.updatedAt = new Date();
    const updatedPost = await post.save();

    return res.json(updatedPost);
  }

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    await Post.remove({ _id: id }).exec();

    return res.json({ message: 'Postagem removida' });
  }
}

export { PostController };