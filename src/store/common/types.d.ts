import { PayloadAction } from '@reduxjs/toolkit';

export interface CommonState {
  loading: boolean;
  balance: string;
  accountAddress: string;
}

export type SetLoadingCommonAction = PayloadAction<boolean>;

