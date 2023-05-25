import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface ITokensSelectProps {
  value: any;
  onChange: (val: string) => void;
}
export const TokensSelect = ({
  value,
  onChange,
}:ITokensSelectProps) => {
  const handleSelectChange = (event: SelectChangeEvent) => {
    const val = event.target.value;
    onChange(val);
  };

  return (
    <FormControl variant="standard">
      <Select
        value={value}
        onChange={handleSelectChange}
      >
        <MenuItem value={'TT_A'}>TT_A</MenuItem>
        <MenuItem value={'TT_B'}>TT_B</MenuItem>
      </Select>
    </FormControl>
  ); 
};
