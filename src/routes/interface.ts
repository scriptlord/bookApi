export interface Book {
  Title: string,
  Author: string,
  dateUploaded?: string
  datePublished: string
  Description: string
  pageCount: number
  Genre: string
  bookId: number
  Publisher: string
  dateEdited?: string
}


export interface User {
  name: string,
  email: string,
  password: string,
  dob: string,
  _id: string
}