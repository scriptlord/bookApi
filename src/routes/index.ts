import express, { Request, Response, NextFunction } from 'express'
import { writeFileSync, readFileSync, existsSync } from 'fs'
const router = express.Router()
let books = require('../../src/routes/appdata/database.json')


/* GET home page. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.send(books)
})

export default router








// if (!existsSync('database.json')) {
//   writeFileSync('database.json', '[]')
// }
// let result = readFileSync('database.json', { encoding: 'utf8' })