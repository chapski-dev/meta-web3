import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import swapReducer from './swap';
import liquidityReducer from './liquidity';
import commonReducer from './common';

const rootReducer = combineReducers({
  swap: swapReducer,
  liquidity: liquidityReducer,
  common: commonReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

setupListeners(store.dispatch);
