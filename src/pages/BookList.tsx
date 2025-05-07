import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import {
  Typography,
  CircularProgress,
  Box,
  Alert,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SelectChangeEvent } from '@mui/material/Select';
import { Book } from '../models/Book';
import { BookService } from '../services/api';
import BookCard from '../components/BookCard';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterAvailable, setFilterAvailable] = useState('');

  // ─── Cargar libros ───────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await BookService.getBooks();
        setBooks(data);
        setFilteredBooks(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los libros. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ─── Filtrado ────────────────────────────────────────────────────────────────
  useEffect(() => {
    let result = [...books];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term) ||
          book.publisher.toLowerCase().includes(term)
      );
    }

    if (filterType) {
      result = result.filter((book) => book.type === filterType);
    }

    if (filterAvailable !== '') {
      const isAvailable = filterAvailable === 'true';
      result = result.filter((book) => book.avaliable === isAvailable);
    }

    setFilteredBooks(result);
  }, [books, searchTerm, filterType, filterAvailable]);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);
  const handleTypeFilterChange = (e: SelectChangeEvent) =>
    setFilterType(e.target.value);
  const handleAvailableFilterChange = (e: SelectChangeEvent) =>
    setFilterAvailable(e.target.value);
  const handleBookDeleted = () => {
    // recargar después de eliminar
    BookService.getBooks().then(setBooks).catch(console.error);
  };

  const bookTypes = Array.from(new Set(books.map((b) => b.type)));

  // ─── UI ──────────────────────────────────────────────────────────────────────
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
      <Typography variant="h4" gutterBottom sx={{ my: 3 }}>
        Catálogo de Libros
      </Typography>

      {/* ── Filtros ───────────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          label="Buscar"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Tipo</InputLabel>
          <Select value={filterType} label="Tipo" onChange={handleTypeFilterChange}>
            <MenuItem value="">Todos</MenuItem>
            {bookTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
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

      {/* ── Lista ─────────────────────────────────────────────────────────────── */}
      {filteredBooks.length === 0 ? (
        <Alert severity="info">No se encontraron libros.</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredBooks.map((book) => (
            <Grid size={{xs: 12, sm:6, md:4}} key={book.id}>
              <BookCard book={book} onDelete={handleBookDeleted} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default BookList;
