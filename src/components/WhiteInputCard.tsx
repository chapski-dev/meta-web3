import { Paper } from '@mui/material';
import React from 'react';

export const WhiteInputCard = ({ children }: any) => (
  <Paper
    elevation={0}
    sx={{
      bgcolor: 'fff', 
      p: '8px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    }}
  >

    {children}
  </Paper>
);
