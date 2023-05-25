import { useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ActionCreatorsMapObject, bindActionCreators } from 'redux';

import type { AppDispatch, RootState } from './types.d';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const createActionsHook =
  <A extends ActionCreatorsMapObject>(actions: A) =>
    () => {
      const dispatch = useDispatch();
      return useMemo(() => bindActionCreators(actions, dispatch), []);
    };
