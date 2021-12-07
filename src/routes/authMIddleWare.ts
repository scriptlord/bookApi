import express, { Request, Response, NextFunction } from 'express'
const jwt = require('jsonwebtoken')

require('dotenv').config()

export function auth(req: Request, res: Response, next: NextFunction) {
 let token = req.header('x-auth-token')
 if (!token) res.status(401).json('Access denied. No token provided')
 try {
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
  req.user = decoded;
  next()
 }
 catch (e) {
  res.status(400).send('Invalid token')
 }
}
