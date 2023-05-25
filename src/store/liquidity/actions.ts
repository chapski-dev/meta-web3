import { createActionsHook } from '../hooks';

import { liquidityActions } from './index';

export const useLiquidityActions = createActionsHook({
  ...liquidityActions,
});
