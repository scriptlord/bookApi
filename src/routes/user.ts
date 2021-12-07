import express, { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
require ('dotenv').config()
import flash from 'express-flash'
import session from 'express-session'
import path from 'path'
import { auth } from './authMIddleWare'
const jwt = require('jsonwebtoken')
import { writejsonFile } from './books'
import joi from 'joi'
import { User } from './interface'
import {readFile, readFileSync, writeFile} from 'fs'
import _ from 'lodash'
const router = express.Router()
let users = require('../../src/routes/appdata/users.json')
let filePath = path.join(__dirname, '../../src/routes/appdata/users.json')

// router.get('/me', auth, (req: Request, res: Response, next: NextFunction) => {
// })
router.get('/headers', (req: Request, res: Response, next: NextFunction)=> {
    res.set('Content-Type', 'text/plain')
    let s = ''
    for (var name in req.headers) s += name + ': ' + req.headers[name] + '\n'
    res.send(s)
  })


//get config vars
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  const { error } = validateUser(req.body)
  
  if (error) return res.status(400).send(error.details[0].message)

  let user = users.find((u: User) => u.email === req.body.email)
  if (user) return res.status(400).send('User already registered')
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10)
    user = {
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
      dob: req.body.dob,
      _id: uuidv4()
    }
    users.push(user)
    writejsonFile(filePath, users)
    let payload = _.pick(user, ['_id'])
    let token = generateAccessToken(payload)
     let response = _.pick(user, ['name', 'email', '_id'])
    res.header('x-auth-token', token).status(201).json(response)
  } catch(e) {
  console.log(e)
  }
})

router.post('/login', async (req, res) => {
  const { error } = validateUserLogin(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  let user = users.find((u: User) => u.email === req.body.email)
  if (!user) return res.status(400).json('Invalid email address. Enter a valid email address')

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).json('Invalid Password. Enter a valid password')
  let payload = _.pick(user, ['_id'])
  let token = generateAccessToken(payload)
  res.json(token)
})


//user model
function validateUser(user: User) {
  const schema = joi.object({
    name: joi.string().min(3).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().min(5).max(10).required(),
    dob: joi.string().required()
  })

  return schema.validate(user)
}

//login payload
function validateUserLogin(user: User) {
  const schema = joi.object({
    email: joi.string().min(5).max(30).email().required(),
    password: joi.string().min(5).max(10).required(),
  })
  return schema.validate(user)
}

//generate Auth token
function generateAccessToken(user: Object) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '24h' })
}

export default router