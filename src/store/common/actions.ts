import { createActionsHook } from '../hooks';

import Web3 from 'web3';
import { handleCatchError } from '../../utils/error-handler';
import { Dispatch } from 'redux';
import { commonActions } from './index';

const loadBlockchainData = () => async (dispatch: Dispatch) => {
  if (window.ethereum) {
    // Инициализируем Web3 с помощью MetaMask провайдера
    const web3Obj = new Web3(window.ethereum);

    try {
      // Запрашиваем у пользователя доступ к его аккаунту MetaMask
      await window.ethereum.enable();
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

const handleLogout = () => async (dispatch: Dispatch) => {
  dispatch(commonActions.setAccount(''));
  dispatch(commonActions.setBalance(''));
};

export const useCommonActions = createActionsHook({
  handleLogout,
  loadBlockchainData,
  ...commonActions,
});
