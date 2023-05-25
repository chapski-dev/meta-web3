// /* eslint-disable no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */

import { Box, Typography } from '@mui/material';
import React, { FC } from 'react';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { LoadingButton } from '@mui/lab';
import { Card, TokensSelect, WhiteInputCard } from '../../../../components';
import { Form } from 'formik';
import { CurrencyField } from '../CurrencyField';

interface ISwapViewProps {
  fromAmount: string;
  setFromAmount: (val: string) => void;
  toAmount: string;
  setToAmount: (val: string) => void;
  currencyFrom: string;
  handleChangeCurrencyA: (val: string) => void;
  handleChangeCurrencyB: (val: string) => void;
  currencyTo: string;
  isZeroBalance: boolean;
  loading: boolean;
}

export const SwapView:FC<ISwapViewProps> = ({
  fromAmount,
  setFromAmount,
  toAmount,
  setToAmount,
  currencyFrom,
  handleChangeCurrencyA,
  handleChangeCurrencyB,
  currencyTo,
  isZeroBalance,
  loading,
}) => (
  <Form>
    <Card>
      <Typography
        variant="h6"
        children="Swap"
        textAlign="left"
      />
      <Typography
        color={'#9CA3AF'}
        children="Easy way to trade your tokens"
        textAlign="left"
        mb={'40px'}
      />
      <Box display="flex" flexDirection="column" gap={'20px'} mb={3}>
        <WhiteInputCard>
          <Box>

            <Typography
              children="From"
              fontSize={'14px'}
              textAlign="left"
            />
            <CurrencyField
              placeholder="0.0"
              value={fromAmount}
              onChange={({ floatValue }) => setFromAmount(floatValue.toString())}
            />
          </Box>
          <TokensSelect
            value={currencyFrom}
            onChange={handleChangeCurrencyA}
          />
        </WhiteInputCard>

        <ArrowDownwardIcon sx={{ alignSelf: 'center' }} />

        <WhiteInputCard>
          <Box>
            <Typography
              children="To"
              fontSize={'14px'}
              textAlign="left"
            />
            <CurrencyField
              placeholder="0.0"
              value={toAmount}
              onChange={({ floatValue }) => setToAmount(floatValue.toString())}
              disabled
            />
          </Box>
          <TokensSelect
            value={currencyTo}
            onChange={handleChangeCurrencyB}
          />
        </WhiteInputCard>
      </Box>
      {isZeroBalance && <Typography color="red" children="Недостаточно средств" />}
      <LoadingButton
        variant="contained"
        children="SWAP Tokens"
        fullWidth
        size="large"
        type="submit"
        loading={loading}
        disabled={loading || !fromAmount || !toAmount}
      />
    </Card>
  </Form>
);
