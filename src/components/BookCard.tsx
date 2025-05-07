import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Chip,
  Box,
  CardMedia
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Book } from '../models/Book';
import { BookService } from '../services/api';

interface BookCardProps {
  book: Book;
  onDelete: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit/${book.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de eliminar el libro "${book.title}"?`)) {
      try {
        await BookService.deleteBook(book.id!);
        onDelete();
      } catch (error) {
        console.error('Error al eliminar el libro:', error);
        alert('No se pudo eliminar el libro. Intenta de nuevo más tarde.');
      }
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {book.photo && (
        <CardMedia
          component="img"
          height="140"
          image={book.photo || 'https://via.placeholder.com/150?text=No+Image'}
          alt={book.title}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Autor: {book.author}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Año: {book.year}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Editorial: {book.publisher}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Chip 
            label={book.type} 
            size="small" 
            color="primary" 
            sx={{ mr: 1 }} 
          />
          <Chip 
            label={book.avaliable ? 'Disponible' : 'No disponible'} 
            size="small" 
            color={book.avaliable ? 'success' : 'error'} 
          />
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleEdit}>Editar</Button>
        <Button size="small" color="error" onClick={handleDelete}>Eliminar</Button>
      </CardActions>
    </Card>
  );
};

export default BookCard;