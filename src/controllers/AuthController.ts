import { Request, Response } from 'express'
import { User } from '@models/User'
import { AppError } from '@errors/AppError'
import { transporter } from 'src/modules/mailer'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

class AuthController {
  private generateToken = (userId: string, expiresSeconds = 86400) => {
    const token = jwt.sign({ id: userId }, process.env.SECRET_KEY, {
      expiresIn: expiresSeconds
    })
    return token
  }

  createAccount = async (req: Request, res: Response) => {
    const { email, userName, isAdmin, password } = req.body
    const errs = []

    if (!String(email).trim() || email === undefined) {
      errs.push({ field: 'email', message: 'Campo obrigatório' })
    }
    if (!String(userName).trim() || userName === undefined) {
      errs.push({ field: 'userName', message: 'Campo obrigatório' })
    }
    if (!String(password).trim() || password === undefined) {
      errs.push({ field: 'password', message: 'Campo obrigatório' })
    }
    if (errs.length) throw new AppError(errs)

    const emailExists = await User.findOne({ email }).exec()
    const userNameExists = await User.findOne({ userName }).exec()

    if (emailExists) {
      errs.push({
        field: 'email',
        message: 'Esse email já está sendo utilizado'
      })
    }
    if (userNameExists) {
      errs.push({
        field: 'userName',
        message: 'Esse nome de usuário já está sendo utilizado'
      })
    }
    if (errs.length) throw new AppError(errs)

    const newUser = new User({ email, userName, isAdmin, password })

    const user = await newUser.save()
    const token = this.generateToken(user.id)
    user.password = undefined

    return res.json({ user, token })
  }

  authenticate = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const errs = []

    if (!String(email).trim() || email === undefined) {
      errs.push({ field: 'email', message: 'Campo obrigatório' })
    }
    if (!String(password).trim() || password === undefined) {
      errs.push({ field: 'password', message: 'Campo obrigatório' })
    }
    if (errs.length) throw new AppError(errs)

    const emailInvalid = {
      field: 'email',
      message: 'E-mail e/ou senha inválidos'
    }
    const passwordInvalid = {
      field: 'password',
      message: 'E-mail e/ou senha inválidos'
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      errs.push(emailInvalid, passwordInvalid)
      throw new AppError(errs)
    }
    const passwordIsValid = await bcrypt.compare(password, user.password)
    if (!passwordIsValid) {
      errs.push(emailInvalid, passwordInvalid)
      throw new AppError(errs)
    }

    user.password = undefined

    const token = this.generateToken(user.id)
    return res.json({ user, token })
  }

  lostPassword = async (req: Request, res: Response) => {
    const { email } = req.body

    if (!String(email).trim() || email === undefined) {
      throw new AppError('Informe seu email')
    }

    const user = await User.findOne({ email })

    if (!user) {
      throw new AppError('Email não cadastrado')
    }

    // @desc RecoverPasswordToken expires in one hour
    const passwordResetToken = crypto.randomBytes(10).toString('hex')
    const passwordResetExpires = new Date()
    passwordResetExpires.setHours(passwordResetExpires.getHours() + 1)

    await User.findByIdAndUpdate(user.id, {
      $set: { passwordResetToken, passwordResetExpires }
    }).exec()

    await transporter.sendMail({
      to: email,
      from: 'gabriel.bloapp@gmail.com',
      subject: 'Recuperação de senha',
      html: `
        <p style="font-family: sans-serif">
          Use essa chave para recuperar sua senha: <strong>${passwordResetToken}</strong>
        </p>
      `
    })

    return res.json({ message: 'Enviamos uma chave secreta para o seu email' })
  }

  recoverPassword = async (req: Request, res: Response) => {
    const { token, email, password } = req.body
    const errs = []

    if (!String(token).trim() || token === undefined) {
      errs.push({ field: 'token', message: 'Campo obrigatório' })
    }
    if (!String(email).trim() || email === undefined) {
      errs.push({ field: 'email', message: 'Campo obrigatório' })
    }
    if (!String(password).trim() || password === undefined) {
      errs.push({ field: 'password', message: 'Campo obrigatório' })
    }
    if (errs.length) throw new AppError(errs)

    const user = await User.findOne({ email }).select(
      '+passwordResetToken passwordResetExpires password'
    )

    const tokenInvalid = {
      field: 'token',
      message: 'Chave secreta e/ou email inválidos'
    }
    const emailInvalid = {
      field: 'email',
      message: 'Chave secreta e/ou email inválidos'
    }

    if (!user) {
      errs.push(emailInvalid, tokenInvalid)
      throw new AppError(errs)
    }
    if (token !== user.passwordResetToken) {
      errs.push(emailInvalid, tokenInvalid)
      throw new AppError(errs)
    }
    if (new Date() > user.passwordResetExpires) {
      throw new AppError(
        [
          {
            field: 'token',
            message: 'Essa chave expirou, faça outra requisição'
          }
        ],
        401
      )
    }

    // @desc Saves the new password
    const userRecovered = await User.findOne({ _id: user.id })
    userRecovered.password = password
    await userRecovered.save()
    userRecovered.password = undefined

    const authToken = this.generateToken(user.id)
    return res.json({ user: userRecovered, token: authToken })
  }

  edit = async (req: Request, res: Response) => {
    const { userName, password, email } = req.body
    let edits = 0

    if (!req.userId) {
      throw new AppError('Não autorizado', 401)
    }
    if (!userName && !password && !email) {
      throw new AppError('Impossível atualizar')
    }

    const user = await User.findOne({ _id: req.userId }).select('+password')

    if (String(userName).trim() && userName !== undefined) {
      user.userName = userName
      edits += 1
    }
    if (String(email).trim() && email !== undefined) {
      user.email = email
      edits += 1
    }
    if (String(password).trim() && password !== undefined) {
      user.password = password
      edits += 1
    }
    if (!edits) throw new AppError('Impossível atualizar')

    user.updatedAt = new Date()
    await user.save()

    return res.json(user)
  }

  delete = async (req: Request, res: Response) => {
    const { password } = req.body

    if (!req.userId) throw new AppError('Não autorizado', 401)

    if (!String(password).trim() || password === undefined) {
      throw new AppError('Informe a sua senha')
    }

    const user = await User.findOne({ _id: req.userId }).select('+password')
    if (!user) throw new AppError('Usuário não encontrado')

    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) throw new AppError('Senha incorreta')

    await User.deleteOne({ _id: user.id }).exec()

    return res.json({ message: 'Usuário removido' })
  }
}

export { AuthController }
