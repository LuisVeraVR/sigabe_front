import axios from 'axios';
import { Book, BookCreate, BookUpdate } from '../models/Book';

const API = axios.create({
  baseURL: 'http://localhost:3000',
});

export const BookService = {
  getBooks: async (): Promise<Book[]> => {
    const response = await API.get('/books/getBooks');
    return response.data;
  },

  createBook: async (book: BookCreate): Promise<Book> => {
    const response = await API.post('/books/createBook', book);
    return response.data;
  },

  updateBook: async (id: number, book: BookUpdate): Promise<Book> => {
    const response = await API.put(`/books/updateBook/${id}`, book);
    return response.data;
  },

  deleteBook: async (id: number): Promise<any> => {
    const response = await API.delete(`/books/deleteBook/${id}`);
    return response.data;
  }
};