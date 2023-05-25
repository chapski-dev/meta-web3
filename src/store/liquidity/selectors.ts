import { RootState } from '../types.d';

export const fromAmount = (state: RootState) => state.liquidity.fromAmount;

export const toAmount = (state: RootState) => state.liquidity.toAmount;

export const currencyFrom = (state: RootState) => state.liquidity.currencyFrom;

export const currencyTo = (state: RootState) => state.liquidity.currencyTo;

export const currencyFromAddr = (state: RootState) => state.liquidity.currencyFromAddr;

export const currencyToAddr = (state: RootState) => state.liquidity.currencyToAddr;

