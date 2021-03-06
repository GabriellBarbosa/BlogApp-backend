import { Post } from '@models/Post'
import { Category } from '@models/Category'
import { Request, Response } from 'express'
import { AppError } from '@errors/AppError'
import { User } from '@models/User'
import { isValidObjectId } from 'mongoose'

class PostController {
  listAll = async (req: Request, res: Response) => {
    const posts = await Post.find()
      .populate('category author')
      .sort({ createdAt: 'desc' })

    return res.json(posts)
  }

  getById = async (req: Request, res: Response) => {
    const { id } = req.params
    if (!isValidObjectId(id)) throw new AppError('Post inválido')

    const post = await Post.findOne({ _id: id }).exec()
    if (!post) throw new AppError('Post não encontrado', 404)

    return res.json(post)
  }

  getByCategory = async (req: Request, res: Response) => {
    const { slug } = req.params

    const category = await Category.findOne({ slug }).exec()
    if (!category) {
      throw new AppError('Categoria não encontrada', 404)
    }
    const posts = await Post.find({ category: category.id })
      .populate('author')
      .sort({ createdAt: 'desc' })

    return res.json({ category, posts })
  }

  add = async (req: Request, res: Response) => {
    if (!req.userId) {
      throw new AppError('Não autorizado', 401)
    }

    const { content, category } = req.body
    const errs = []

    if (!String(content).trim() || content === undefined) {
      errs.push({ field: 'content', message: 'Campo obrigatório' })
    }
    if (!String(category).trim() || category === undefined) {
      errs.push({ field: 'category', message: 'Campo obrigatório' })
    }
    if (errs.length) {
      throw new AppError(errs)
    }

    const categoryExists = await Category.findOne({ _id: category }).exec()
    if (!categoryExists) throw new AppError('Categoria inválida')

    const userExists = await User.findOne({ _id: req.userId }).exec()
    if (!userExists) throw new AppError('Usuário inválido')

    const newPost = new Post({ author: userExists.id, content, category })
    const post = await newPost.save()

    return res.json(post)
  }

  edit = async (req: Request, res: Response) => {
    if (!req.userId) {
      throw new AppError('Não autorizado', 401)
    }

    const { id } = req.params
    const { content, category } = req.body

    if (!isValidObjectId(id)) {
      throw new AppError('ID inválido')
    }

    const post = await Post.findOne({ _id: id }).exec()

    if (!post) {
      throw new AppError('Postagem não encontrada', 404)
    }

    const user = await User.findOne({ _id: post.author }).exec()

    if (req.userId !== user.id) {
      throw new AppError('Não autorizado', 401)
    }
    if (!content && !category) {
      throw new AppError('Impossível atualizar')
    }
    if (content) {
      post.content = content
    }
    if (category) {
      const categoryExists = await Category.findOne({ _id: category }).exec()
      if (!categoryExists) throw new AppError('Categoria inválida')
      post.category = category
    }

    post.updatedAt = new Date()
    const updatedPost = await post.save()

    return res.json(updatedPost)
  }

  delete = async (req: Request, res: Response) => {
    if (!req.userId) {
      throw new AppError('Não autorizado', 401)
    }
    const { id } = req.params

    if (!isValidObjectId(id)) {
      throw new AppError('ID inválido')
    }

    const post = await Post.findOne({ _id: id }).exec()
    if (!post) {
      throw new AppError('Postagem não encontrada', 404)
    }

    const user = await User.findOne({ _id: post.author }).exec()
    if (!user) {
      throw new AppError('Usuário inválido', 404)
    }

    if (req.userId !== user.id) {
      throw new AppError('Não autorizado', 401)
    }

    await Post.deleteOne({ _id: id }).exec()
    return res.json({ message: 'Postagem removida' })
  }
}

export { PostController }
