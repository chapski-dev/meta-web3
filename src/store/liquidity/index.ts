import { CurrencyEnum, Token_A, Token_B } from '../../constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LiquidityState } from './types';

const initialState: LiquidityState = {
  fromAmount: '',
  toAmount: '',
  currencyFrom: CurrencyEnum.tETH,
  currencyTo: CurrencyEnum.tMATIC,
  currencyFromAddr: Token_A,
  currencyToAddr: Token_B,
};

const slice = createSlice({
  initialState,
  name: 'liquidity',
  reducers: {
    setFromAmount(state, action: PayloadAction<string>) {
      state.fromAmount = action.payload;
    },
    setToAmount(state, action: PayloadAction<string>) {
      state.toAmount = action.payload;
    },
    setCurrencyFrom(state, action: PayloadAction<CurrencyEnum>) {
      state.currencyFrom = action.payload;
    },
    setCurrencyTo(state, action: PayloadAction<string>) {
      state.currencyTo = action.payload;
    },
    setCurrencyFromAddr(state, action: PayloadAction<string>) {
      state.currencyFromAddr = action.payload;
    },
    setCurrencyToAddr(state, action: PayloadAction<string>) {
      state.currencyToAddr = action.payload;
    },
  },
});

export default slice.reducer;

export const liquidityActions = slice.actions;
