import { RootState } from '../types.d';

export const fromAmount = (state: RootState) => state.swap.fromAmount;

export const toAmount = (state: RootState) => state.swap.toAmount;

export const currencyFrom = (state: RootState) => state.swap.currencyFrom;

export const currencyTo = (state: RootState) => state.swap.currencyTo;

export const currencyFromAddr = (state: RootState) => state.swap.currencyFromAddr;

export const currencyToAddr = (state: RootState) => state.swap.currencyToAddr;

