import { Request, Response } from "express";
import { User } from "@models/User";
import { AppError } from "@errors/AppError";
import bcrypt from 'bcrypt';

class UserController {
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
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) throw new Error(err.message);
        console.log(hash);
        newUser.password = hash;
        await newUser.save();
      });
    });

    res.json({ message: 'Usuário criado com sucesso' });
  }
}

export { UserController };
