import { Request, Response } from 'express'
import { Comment } from '@models/Comment'
import { Post } from '@models/Post'
import { User } from '@models/User'
import { AppError } from '@errors/AppError'
import { isValidObjectId } from 'mongoose'

class CommentController {
  listByPost = async (req: Request, res: Response) => {
    const postId = req.params.id

    if (!isValidObjectId(postId)) {
      throw new AppError('Post ID inválido')
    }

    const post = await Post.findOne({ _id: postId }).exec()

    if (!post) {
      throw new AppError('Postagem não encontrada', 404)
    }

    const comments = await Comment.find({ post: post.id })
      .populate('author')
      .sort({ createdAt: 'desc' })

    return res.json(comments)
  }

  add = async (req: Request, res: Response) => {
    if (!req.userId) {
      throw new AppError('Não autorizado', 401)
    }

    const { comment } = req.body
    const postId = req.params.id

    const errs = []

    if (!isValidObjectId(postId)) {
      throw new AppError('Post ID inválido')
    }

    const post = await Post.findOne({ _id: postId }).exec()

    if (!post) {
      throw new AppError('Post não encontrado', 404)
    }
    if (!String(comment).trim() || comment === undefined) {
      errs.push({ field: 'comment', message: 'Campo obrigatório' })
    }
    if (errs.length) {
      throw new AppError(errs)
    }

    const newComment = new Comment({
      author: req.userId,
      post: post.id,
      comment
    })
    await newComment.save()

    return res.json(newComment)
  }

  edit = async (req: Request, res: Response) => {
    if (!req.userId) {
      throw new AppError('Não autorizado', 401)
    }

    const id = req.params.id
    const { comment } = req.body

    if (!isValidObjectId(id)) {
      throw new AppError('Comment ID inválido')
    }
    if (!String(comment).trim() || comment === undefined) {
      throw new AppError('Impossível atualizar')
    }

    const editComment = await Comment.findOne({ _id: id }).exec()

    if (!editComment) {
      throw new AppError('Comentário não encontrado')
    }

    const commentAuthor = await User.findOne({ _id: editComment.author }).exec()

    if (req.userId !== commentAuthor.id) {
      throw new AppError('Não autorizado', 401)
    }

    editComment.comment = comment
    editComment.updatedAt = new Date()
    await editComment.save()

    return res.json(editComment)
  }

  delete = async (req: Request, res: Response) => {
    if (!req.userId) {
      throw new AppError('Não autorizado', 401)
    }

    const id = req.params.id

    if (!isValidObjectId(id)) {
      throw new AppError('Comment ID inválido')
    }

    const deleteComment = await Comment.findOne({ _id: id }).exec()

    if (!deleteComment) {
      throw new AppError('Comentário não encontrado')
    }

    const commentAuthor = await User.findOne({
      _id: deleteComment.author
    }).exec()

    if (req.userId !== commentAuthor.id) {
      throw new AppError('Não autorizado', 401)
    }

    await Comment.deleteOne({ id: deleteComment.id }).exec()

    res.json({ message: 'Comentário removido' })
  }
}

export { CommentController }
