import { createActionsHook } from '../hooks';

import Web3 from 'web3';
import { handleCatchError } from '../../utils/error-handler';
import { Dispatch } from 'redux';
import { commonActions } from './index';

const loadBlockchainData = () => async (dispatch: Dispatch) => {
  if (window.ethereum) {
    const ethereum = window.ethereum;
    // Инициализируем Web3 с помощью MetaMask провайдера
    const web3Obj = new Web3(ethereum);

    try {
      // Запрашиваем у пользователя доступ к его аккаунту MetaMask
      await ethereum.enable();
      // Получаем адрес аккаунта пользователя
      const accounts = await web3Obj.eth.getAccounts();
      console.log('accounts', accounts);
      dispatch(commonActions.setAccount(accounts[0]));
      
      // Получаем баланс пользователя
      const balanceAcc = await web3Obj.eth.getBalance(accounts[0]);
      dispatch(commonActions.setBalance(balanceAcc));
    } catch (error) {
      handleCatchError(error);
    }
  }
};

export const useCommonActions = createActionsHook({
  loadBlockchainData,
  ...commonActions,
});
