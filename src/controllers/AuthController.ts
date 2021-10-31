import { Request, Response } from "express";
import { User } from "@models/User";
import { AppError } from "@errors/AppError";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthController {
  private generateToken = (userId: string, expiresSeconds: number) => {
    const token = jwt.sign({ id: userId }, process.env.SECRET_KEY, {
      expiresIn: expiresSeconds
    });
    
    return token;
  }

  createAccount = async(req: Request, res: Response) => {
    const { email, userName, isAdmin, password } = req.body;
    let errs = [];

    if (!String(email).trim() || email === undefined)
      errs.push({ field: 'email', message: 'Campo obrigatório' });
    if (!String(userName).trim() || userName === undefined)
      errs.push({ field: 'userName', message: 'Campo obrigatório' });
    if (!String(password).trim() || password === undefined)
      errs.push({ field: 'password', message: 'Campo obrigatório' });
    if (errs.length) throw new AppError(errs);

    const emailExists = await User.findOne({ email }).exec();
    const userNameExists = await User.findOne({ userName }).exec();

    if (emailExists)
      errs.push({ field: 'email', message: 'Esse email já está sendo utilizado' });
    if (userNameExists)
      errs.push({ field: 'userName', message: 'Esse nome de usuário já está sendo utilizado' });
    if (errs.length) throw new AppError(errs);
    
    const newUser = new User({ email, userName, isAdmin, password });
    
    // hash password and saves the user
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) throw new Error(err.message);
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) throw new Error(err.message);

        newUser.password = hash;
        const user = await newUser.save();
        user.password = undefined;

        const token = this.generateToken(user.id, 86400);
        return res.json({ user, token });
      });
    });
  }

  authenticate = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    let errs = [];

    if (!String(email).trim() || email === undefined)
      errs.push({ field: 'email', message: 'Campo obrigatório' });
    if (!String(password).trim() || password === undefined)
      errs.push({ field: 'password', message: 'Campo obrigatório' });
    if (errs.length) throw new AppError(errs);

    const emailInvalid = { 
      field: 'email', 
      message: 'E-mail e/ou senha inválidos' 
    }
    const passwordInvalid = { 
      field: 'password', 
      message: 'E-mail e/ou senha inválidos' 
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      errs.push(emailInvalid, passwordInvalid);
      throw new AppError(errs);
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      errs.push(emailInvalid, passwordInvalid);
      throw new AppError(errs);
    }

    user.password = undefined;

    const token = this.generateToken(user.id, 84600);
    return res.json({ user, token });
  }
}

export { AuthController };
