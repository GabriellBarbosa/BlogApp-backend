import { Request, Response } from 'express';
import { Comment } from '@models/Comment';
import { Post } from '@models/Post';
import { AppError } from '@errors/AppError';
import { isValidObjectId } from 'mongoose';

class CommentController {

  listByPost = async (req: Request, res: Response) => {
    const postId = req.params.id;

    if(!isValidObjectId(postId))
      throw new AppError('Post ID inválido');
    
    const post = await Post.findOne({ _id: postId }).exec()

    if (!post)
      throw new AppError('Postagem não encontrada', 404);

    const comments = await Comment.find({ post: post.id }).exec();

    return res.json(comments);
  }
  
  add = async (req: Request, res: Response) => {
    if (!req.userId)
      throw new AppError('Não autorizado', 401);
    
    const { comment } = req.body;
    const postId = req.params.id;

    let errs = [];

    if(!isValidObjectId(postId))
      throw new AppError('Post ID inválido');

    const post = await Post.findOne({ _id: postId }).exec();

    if (!post)
      throw new AppError('Post não encontrado', 404);
    if (!String(comment).trim() || comment === undefined)
      errs.push({ field: 'comment', message: 'Campo obrigatório' });
    if (errs.length)
      throw new AppError(errs);

    const newComment = new Comment({ 
      author: req.userId, 
      post: post.id, 
      comment 
    });
    await newComment.save();

    return res.json(newComment);
  }
}

export { CommentController };