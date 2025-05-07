import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Box, 
  FormControl, 
  FormControlLabel, 
  InputLabel, 
  Select, 
  MenuItem,
  Switch,
  Alert,
  CircularProgress
} from '@mui/material';
import { Book, BookCreate, BookUpdate } from '../models/Book';
import { BookService } from '../services/api';

type BookFormData = {
  title: string;
  author: string;
  year: string;
  publisher: string;
  type: string;
  photo: string;
  avaliable: boolean;
};

const initialFormData: BookFormData = {
  title: '',
  author: '',
  year: '',
  publisher: '',
  type: '',
  photo: '',
  avaliable: true
};

const BookForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<BookFormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (isEditMode) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const books = await BookService.getBooks();
      const book = books.find(b => b.id === Number(id));
      
      if (book) {
        setFormData({
          title: book.title,
          author: book.author,
          year: book.year.toString(),
          publisher: book.publisher,
          type: book.type,
          photo: book.photo || '',
          avaliable: book.avaliable
        });
      } else {
        setError(`No se encontró el libro con ID ${id}`);
      }
    } catch (err) {
      console.error('Error al cargar el libro:', err);
      setError('No se pudo cargar la información del libro.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = event.target.name as keyof BookFormData;
    const value = event.target.value;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      avaliable: event.target.checked
    }));
  };

  const validateForm = (): boolean => {
    // Validación básica
    if (!formData.title || !formData.author || !formData.year || !formData.publisher || !formData.type) {
      setError('Por favor completa todos los campos obligatorios.');
      return false;
    }

    // Validar que el año sea un número
    if (isNaN(Number(formData.year))) {
      setError('El año debe ser un número.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      const bookData = {
        title: formData.title,
        author: formData.author,
        year: Number(formData.year),
        publisher: formData.publisher,
        type: formData.type,
        photo: formData.photo || undefined,
        avaliable: formData.avaliable
      };
      
      if (isEditMode) {
        await BookService.updateBook(Number(id), bookData as BookUpdate);
      } else {
        await BookService.createBook(bookData as BookCreate);
      }
      
      // Navegar de regreso a la lista después de guardar
      navigate('/');
    } catch (err) {
      console.error('Error al guardar el libro:', err);
      setError('No se pudo guardar el libro. Por favor intenta de nuevo más tarde.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 4, mt: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? 'Editar Libro' : 'Añadir Nuevo Libro'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Título"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Autor"
              name="author"
              value={formData.author}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Año"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Editorial"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Tipo</InputLabel>
              <Select
                name="type"
                value={formData.type}
                label="Tipo"
                onChange={handleChange}
              >
                <MenuItem value="Ficción">Ficción</MenuItem>
                <MenuItem value="No Ficción">No Ficción</MenuItem>
                <MenuItem value="Técnico">Técnico</MenuItem>
                <MenuItem value="Académico">Académico</MenuItem>
                <MenuItem value="Infantil">Infantil</MenuItem>
                <MenuItem value="Juvenil">Juvenil</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="URL de Imagen"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.avaliable}
                  onChange={handleSwitchChange}
                  name="avaliable"
                  color="primary"
                />
              }
              label="Disponible"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={saving}
          >
            {saving ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Guardando...
              </>
            ) : (
              'Guardar'
            )}
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default BookForm;