require("dotenv").config()
import createError from 'http-errors'
import express, { Request, Response, NextFunction } from 'express'
import path from 'path'
require('dotenv').config()
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import os from 'os'
import cors from 'cors'
import bcrypt from 'bcrypt'
import passport from 'passport'
import flash from 'express-flash'
import session from 'express-session'



import indexRouter from './routes/index'
import booksRouter from './routes/books'
import userRouter from './routes/user'
import { nextTick } from 'process'


const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// app.use(passport.initialize())
// app.use(passport.session())
// app.use(flash())


app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(require('cors')())

app.use(function (req, res, next) {
  console.log(process.env.ACCESS_TOKEN_SECRET_KEY)
  next()
}
)

app.use('/home', indexRouter)
app.use('/books', booksRouter)
app.use('/user', userRouter)
// app.use('/login', yyy)



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err:any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// app.get('/', () => console.log('Hello World'))

// const PORT = process.env.PORT || 5000

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

export default app
