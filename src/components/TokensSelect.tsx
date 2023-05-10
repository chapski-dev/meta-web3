import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React from 'react';

interface ITokensSelectProps {
  value: any;
  onChange?: ((event: SelectChangeEvent<any>, child: React.ReactNode) => void) | undefined;
}
export const TokensSelect = ({
  value,
  onChange,
}:ITokensSelectProps) => (
  <FormControl variant="standard">
    <Select
      value={value}
      onChange={onChange}
    >
      <MenuItem value={'MATIC'}>MATIC</MenuItem>
      <MenuItem value={'ETH'}>ETH</MenuItem>
    </Select>
  </FormControl>
);
