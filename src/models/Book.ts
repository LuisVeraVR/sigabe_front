export interface Book {
    id?: number;
    title: string;
    author: string;
    year: number;
    publisher: string;
    type: string;
    photo?: string;
    avaliable: boolean;
  }
  
  export type BookCreate = Omit<Book, 'id'>;
  
  export type BookUpdate = Partial<Book>;