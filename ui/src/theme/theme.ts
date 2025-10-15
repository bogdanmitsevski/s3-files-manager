import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#829ef5',
      dark: '#4c5eaf',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#764ba2',
      light: '#9169b9',
      dark: '#523471',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f3f4f6',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      marginBottom: '0.5rem',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      color: 'rgba(0, 0, 0, 0.7)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
