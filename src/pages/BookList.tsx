import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Grid, 
  CircularProgress, 
  Box, 
  Alert,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Book } from '../models/Book';
import { BookService } from '../services/api';
import BookCard from '../components/BookCard';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterAvailable, setFilterAvailable] = useState<string>('');

  // Cargar los libros al montar el componente
  useEffect(() => {
    fetchBooks();
  }, []);

  // Filtrar libros cuando cambian los criterios de búsqueda o filtrado
  useEffect(() => {
    filterBooks();
  }, [books, searchTerm, filterType, filterAvailable]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await BookService.getBooks();
      setBooks(data);
      setFilteredBooks(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar los libros:', err);
      setError('No se pudieron cargar los libros. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let result = [...books];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(book => 
        book.title.toLowerCase().includes(term) || 
        book.author.toLowerCase().includes(term) ||
        book.publisher.toLowerCase().includes(term)
      );
    }

    // Filtrar por tipo
    if (filterType) {
      result = result.filter(book => book.type === filterType);
    }

    // Filtrar por disponibilidad
    if (filterAvailable !== '') {
      const isAvailable = filterAvailable === 'true';
      result = result.filter(book => book.avaliable === isAvailable);
    }

    setFilteredBooks(result);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeFilterChange = (event: SelectChangeEvent) => {
    setFilterType(event.target.value);
  };

  const handleAvailableFilterChange = (event: SelectChangeEvent) => {
    setFilterAvailable(event.target.value);
  };

  const handleBookDeleted = () => {
    fetchBooks(); // Recargar la lista después de eliminar
  };

  // Obtener tipos únicos para el filtro
  const bookTypes = Array.from(new Set(books.map(book => book.type)));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 3 }}>
        Catálogo de Libros
      </Typography>

      {/* Filtros y búsqueda */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          label="Buscar"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1, minWidth: '200px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl sx={{ minWidth: '150px' }}>
          <InputLabel>Tipo</InputLabel>
          <Select
            value={filterType}
            label="Tipo"
            onChange={handleTypeFilterChange}
          >
            <MenuItem value="">Todos</MenuItem>
            {bookTypes.map(type => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: '150px' }}>
          <InputLabel>Disponibilidad</InputLabel>
          <Select
            value={filterAvailable}
            label="Disponibilidad"
            onChange={handleAvailableFilterChange}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="true">Disponibles</MenuItem>
            <MenuItem value="false">No disponibles</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Lista de libros */}
      {filteredBooks.length === 0 ? (
        <Alert severity="info">
          No se encontraron libros con los criterios de búsqueda actuales.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredBooks.map(book => (
            <Grid item key={book.id} xs={12} sm={6} md={4}>
              <BookCard book={book} onDelete={handleBookDeleted} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default BookList;