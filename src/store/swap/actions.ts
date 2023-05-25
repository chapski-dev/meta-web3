import { createActionsHook } from '../hooks';

import { swapActions } from './index';

export const useSwapActions = createActionsHook({
  ...swapActions,
});
