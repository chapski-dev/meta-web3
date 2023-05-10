import { Paper } from '@mui/material';

export const Card = ({ children }: any) => (
  <Paper sx={{ p: '36px', bgcolor: '#E5E7EB' }} elevation={3}>
    {children}
  </Paper>
);
