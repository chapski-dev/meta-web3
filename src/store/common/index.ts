import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CommonState, SetLoadingCommonAction } from './types';

const initialState: CommonState = {
  loading: false,
  balance: '',
  accountAddress: '',
};

const slice = createSlice({
  initialState,
  name: 'common',
  reducers: {
    setLoading(state, action: SetLoadingCommonAction) {
      state.loading = action.payload;
    },
    setAccount(state, action: PayloadAction<string>) {
      state.accountAddress = action.payload;
    },
    setBalance(state, action: PayloadAction<string>) {
      state.balance = action.payload;
    },
  },
});

export default slice.reducer;

export const commonActions = slice.actions;
