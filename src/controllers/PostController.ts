import { Post } from '@models/Post'
import { Category } from '@models/Category'
import { Request, Response } from 'express'
import { AppError } from '@errors/AppError'
import { User } from '@models/User'

class PostController {
  listAll = async (req: Request, res: Response) => {
    const posts = await Post
      .find()
      .populate('category author')
      .sort({ createdAt: 'desc' })

    return res.json(posts)
  }

  add = async (req: Request, res: Response) => {
    if (!req.userId) { throw new AppError('Não autorizado', 401) }

    const { content, slug, category } = req.body
    const errs = []

    if (!String(content).trim() || content === undefined) {
      errs.push({ field: 'content', message: 'Campo obrigatório' })
    }
    if (!String(slug).trim() || slug === undefined) {
      errs.push({ field: 'slug', message: 'Campo obrigatório' })
    }
    if (!String(category).trim() || category === undefined) {
      errs.push({ field: 'category', message: 'Campo obrigatório' })
    }
    if (errs.length) { throw new AppError(errs) }

    const categoryExists = await Category.findOne({ _id: category }).exec()
    if (!categoryExists) throw new AppError('Categoria inválida')

    const newPost = new Post({ author: req.userId, content, slug, category })
    const post = await newPost.save()

    return res.json(post)
  }

  edit = async (req: Request, res: Response) => {
    if (!req.userId) { throw new AppError('Não autorizado', 401) }

    const { id } = req.params
    const { content, slug, category } = req.body

    const post = await Post.findOne({ _id: id }).exec()

    if (!post) { throw new AppError('Postagem não encontrada', 404) }

    const user = await User.findOne({ _id: post.author }).exec()

    if (req.userId !== user.id) { throw new AppError('Não autorizado', 401) }
    if (!content && !slug && !category) { throw new AppError('Impossível atualizar') }
    if (content) { post.content = content }
    if (slug) { post.slug = slug }
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
    if (!req.userId) { throw new AppError('Não autorizado', 401) }
    const { id } = req.params

    const post = await Post.findOne({ _id: id }).exec()
    if (!post) { throw new AppError('Postagem não encontrada', 404) }

    const user = await User.findOne({ id: post.author }).exec()
    if (req.userId !== user.id) { throw new AppError('Não autorizado', 401) }

    await Post.deleteOne({ _id: id }).exec()
    return res.json({ message: 'Postagem removida' })
  }
}

export { PostController }
