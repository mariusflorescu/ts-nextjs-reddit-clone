import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import User from '../entities/User';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import auth from '../middleware/auth';

const register = async (req:Request,res:Response) => {
  const {username,email,password} = req.body;

  try {
    let errors:any = {};
    const username_user = await User.findOne({username});
    const email_user = await User.findOne({email});

    if(username_user) errors.username = 'Username taken';
    if(email_user) errors.email = 'Email taken';

    if(Object.keys(errors).length > 0){
      return res.status(400).json(errors);
    }

    const user = new User({username,email,password});
    errors = await validate(user);
    if(errors.length > 0) return res.status(400).json({errors});

    await user.save();
    
    return res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

const login = async (req:Request,res:Response) => {
  const {username,password} = req.body;

  try {
    let errors:any = {};

    if(isEmpty(username)) errors.username = 'Username must not be empty';
    if(isEmpty(password)) errors.password = 'Password must not be empty';

    if(Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = await User.findOne({username});
    if(!user) return res.status(401).json("Invalid credentials");

    const passwordHashed = await bcrypt.compare(password,user.password);

    if(!passwordHashed) return res.status(401).json("Invalid credentials");

    const token = jwt.sign({username},process.env.JWT_SECRET);

    res.set('Set-Cookie', cookie.serialize('token',token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600*24*30,
      path: '/'
    }))

    return res.json(user);
  } catch (err) {
    
  }
}

const me = (_:Request,res:Response) => {
  return res.json(res.locals.user);
}

const logout = async (_:Request,res:Response) => {
  res.set('Set-Cookie',cookie.serialize('token','', {
    httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/'
  }))

  return res.status(200).json({success: true});
}

const router = Router();
router.post('/register',register);
router.post('/login',login);
router.get('/me',auth,me);
router.get('/logout',auth,logout);

export default router;