import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#34B78F',
      contrastText: '#fff',
    },
    secondary: {
      main: '#E6E6E6',
      contrastText: '#222A30',
    },
    info: {
      main: '#5B6770',
    },
  },
  typography: {
    allVariants: {
      color: '#3B4750',
    },
  },
  
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#222A30 !important',
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          paddingLeft: 8,
          background: 'white',
        },
        sizeSmall: {
          height: 36,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedSizeMedium: {
          lineHeight: 1.5,
          boxShadow: 'none',
        },
        root: {
          fontSize: 16,
          textTransform: 'none',
          fontWeight: 400,
          flexShrink: 0,
          boxShadow: 'none',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          paddingLeft: 28,
          paddingRight: '8px !important',
        },
        icon: {
          right: 'auto',
          left: 7,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '16px',
          lineHeight: '22px',
        },
      },
    },

  },
});