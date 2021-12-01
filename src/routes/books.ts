import express, { Request, Response, NextFunction } from 'express'
const router = express.Router()
import path from 'path'
import joi from 'joi'
import { Book } from './interface'
let books = require('../../src/routes/appdata/database.json')
import { writeFile } from 'fs'
let filePath = path.join(__dirname, '../../src/routes/appdata/database.json')

/* GET books listing. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  // writejsonFile(filePath, books)
  res.status(200).json(books)
})

/* GET particular book by ID */
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  let book = books.find((c: Book) => c.bookId === parseInt(req.params.id))
  if (!book)
    return res.status(404).send('The book with the given ID was not found.')

  res.status(200).json(book)
})

/* POST a new book by ID */
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  // const { error } = validateGenre(req.body)
  // if (error) return res.status(400).send(error.details[0].message)

  const book: Book = {
    Title: req.body.Title,
    Author: req.body.Author,
    datePublished: req.body.datePublished,
    Description: req.body.Description,
    pageCount: req.body.pageCount,
    Genre: req.body.Genre,
    bookId: books.length + 1,
    Publisher: req.body.Publisher,
  }

  books.push(book)
  writejsonFile(filePath, books)

  res.status(201).json(book)
})

router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  // const { error } = validateGenre(req.body)
  // if (error) return res.status(400).send(error.details[0].message)
  let book = books.find((b: Book) => b.bookId === parseInt(req.params.id))
  if (!book)
    return res.status(404).send('The book with the given ID was not found.')
  let body = req.body
  let result = update(book, body)
  writejsonFile(filePath, books)
  res.status(200).json(result)
})

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  const book = books.find((b: Book) => b.bookId === parseInt(req.params.id))
  if (!book)
    return res.status(404).send('The book with the given ID was not found.')

  const index = books.indexOf(book)
  books.splice(index, 1)
  writejsonFile(filePath, books)
  res.status(200).json(books)
})

function validateGenre(book: Book) {
  const schema = joi.object({
    Title: joi.string().min(3).max(30).required(),
    Author: joi.string().min(3).required(),
    datePublished: joi.string(),
    Description: joi.string().min(3),
    pageCount: joi.number(),
    Genre: joi.string().min(3).max(30),
    Publisher: joi.string().min(3).max(30),
  })

  return schema.validate(book)
}

function writejsonFile(filep: string, content: any) {
  writeFile(filep, JSON.stringify(content, null, 3), (err) => {
    if (err) return
  })
}

function update(book: Book, updatedBook: Book) {
  book.Title = updatedBook.Title ? updatedBook.Title : book.Title
  book.Author = updatedBook.Author ? updatedBook.Author : book.Author
  book.datePublished = updatedBook.datePublished
    ? updatedBook.datePublished
    : book.datePublished
  book.Description = updatedBook.Description
    ? updatedBook.Description
    : book.Description
  book.pageCount = updatedBook.pageCount
    ? updatedBook.pageCount
    : book.pageCount
  book.Genre = updatedBook.Genre ? updatedBook.Genre : book.Genre
  book.Publisher = updatedBook.Publisher
    ? updatedBook.Publisher
    : book.Publisher
  book.dateEdited = new Date().toUTCString()
  return book
}

export default router
