import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import BookList from './pages/BookList';
import BookForm from './pages/BookForm';
import Navbar from './components/Navbar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/create" element={<BookForm />} />
            <Route path="/edit/:id" element={<BookForm />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;