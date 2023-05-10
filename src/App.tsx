import './App.css';
import { Meta } from './views';
import React, { useState } from 'react';

import Web3 from 'web3';
import { Container } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { Header } from './components/Header';
import { handleCatchError } from './utils/error-handler';

function App() {
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [balance, setBalance] = useState('');

  const loadBlockchainData = async () => {
    if (window.ethereum) {
      // Инициализируем Web3 с помощью MetaMask провайдера
      const web3Obj = new Web3(window.ethereum);

      try {
        // Запрашиваем у пользователя доступ к его аккаунту MetaMask
        await window.ethereum.enable();
        // Получаем адрес аккаунта пользователя
        const accounts = await web3Obj.eth.getAccounts();
        setAccount(accounts[0]);
        setWeb3(web3Obj);
        // Получаем баланс пользователя
        const balanceAcc = await web3Obj.eth.getBalance(accounts[0]);
        setBalance(balanceAcc);
      } catch (error) {
        handleCatchError(error);
      }
    }
  };

  const handleLogout = () => {
    setAccount('');
    setWeb3(null);
    setBalance('');
  };

  return (
    <>
      <div className="App">
        <Header
          isAuth={!!account && !!web3}
          web3={web3}
          loadBlockchainData={loadBlockchainData}
          account={account}
          balance={balance}
          handleLogout={handleLogout}
        />
        <Container maxWidth="sm">
          
          {(account && web3) && (
            <>
              <Meta 
                web3={web3}
                account={account}
                balance={balance}
              />
            </>
          )} 
        </Container>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
