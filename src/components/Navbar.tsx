import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <LibraryBooksIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Biblioteca Digital
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
          >
            Libros
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/create"
          >
            Nuevo Libro
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;