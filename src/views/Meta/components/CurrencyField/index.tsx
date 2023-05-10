import CurrencyFormat, { Values } from 'react-currency-format';
import { SxProps, TextField, TextFieldProps, Theme } from '@mui/material';
import { useCallback } from 'react';

interface CurrencyFieldProps
    extends Pick<TextFieldProps, 'size' | 'fullWidth' | 'placeholder'> {
  value?: number | string;
  onChange?: (values: Values) => void;
  sx?: SxProps<Theme>;
  error?: boolean;
  suffix?: string;
  prefix?: string;
  disabled?: boolean;
  required?: boolean;
  fixedDecimalScale?: boolean;
}
const stopPropagation = (e: React.SyntheticEvent) => e.stopPropagation();

export const CurrencyField: React.FC<CurrencyFieldProps> = ({
  sx,
  value,
  placeholder,
  onChange,
  fullWidth,
  size,
  error,
  suffix,
  prefix,
  disabled,
  required,
}) => {
  const CustomTextField = useCallback(
    (props: any) => (
      <TextField
        sx={sx}
        {...props}
        size={size}
        fullWidth={fullWidth}
        variant="standard"
      />
    ),
    [],
  );

  return (
    <CurrencyFormat
      onBlur={stopPropagation}
      disabled={disabled}
      value={value}
      onValueChange={onChange}
      allowNegative={false}
      thousandSeparator=" "
      error={error}
      decimalSeparator="."
      suffix={suffix}
      placeholder={placeholder}
      customInput={CustomTextField}
      required={required}
      prefix={prefix}
    />
  );
};

