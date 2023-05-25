import { Paper } from '@mui/material';

export const Card = ({ children, style }: any) => (
  <Paper sx={{ p: '36px', bgcolor: '#E5E7EB', ...style }} elevation={3}>
    {children}
  </Paper>
);
