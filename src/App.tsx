import './App.css';
import { Meta } from './views';
import { Box, Button, Container, Typography } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { Header } from './components/Header';
import Web3 from 'web3';
import { useSelector } from 'react-redux';
import * as commonSelector from './store/common/selectors';
import { useEffect, useMemo, useState } from 'react';
import { handleCatchError, notifyError, notifySuccess, notifyWarning } from './utils/error-handler';
import debounce from 'lodash.debounce';
import { useCommonActions } from 'src/store/common/actions';

const checkNetwork = async (setIsSepoliaNetwork: (val: boolean) => void) => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      const networkId = await web3.eth.net.getId();

      // Сеть Ethereum Sepolia имеет идентификатор 11155111
      if (networkId !== 11155111) {
        notifyError('You are not connected to the Ethereum Sepolia network.');
        setIsSepoliaNetwork(false);
      } else {
        setIsSepoliaNetwork(true);
      }
    } catch (error) {
      handleCatchError(error);
      notifyError('Network test error');
    }
  } else {
    // MetaMask не доступен, предупредите пользователя
    handleCatchError('MetaMask not found. Please install MetaMask and connect to the Sepolia network.');
  }
};

// Подписка на изменение сети
const subscribeToNetworkChanges = (setIsSepoliaNetwork: (val: boolean) => void) => {
  window.ethereum.on('chainChanged', (chainId: any) => {
    if (chainId === '0xaa36a7') {
      notifySuccess('You have switched to the Ethereum Sepolia network.');
      setIsSepoliaNetwork(true);
    } else {
      notifyWarning('You have switched to another Ethereum network.');
      setIsSepoliaNetwork(false);
    }
  });
};

const changeNetworkAndConnect = async () => {
  // Проверяем, доступен ли MetaMask в браузере пользователя
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    const ethereum = window.ethereum;

    // Получаем ID текущей сети MetaMask
    const networkId = await web3.eth.net.getId();

    // Проверяем, является ли текущая сеть Sepolia
    if (networkId !== 11155111) {
      // Открываем окно MetaMask для выбора другой сети
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      });
    }

    // Подключаемся к MetaMask
    await ethereum.request({ method: 'eth_requestAccounts' });

    // Теперь вы можете выполнять действия, связанные с аккаунтом пользователя
    // и использовать web3 для взаимодействия с блокчейном
  } else {
    // MetaMask не доступен, предупредите пользователя
    handleCatchError('MetaMask not found. Please install MetaMask and connect to the Sepolia network.');
  }
};

function App() {
  const web3 = new Web3(window.ethereum);
  const account = useSelector(commonSelector.accountAddress);
  const isAuth = !!account && !!web3;
  const [isSepoliaNetwork, setIsSepoliaNetwork] = useState(false);

  // Вызов функции проверки сети
  const checkWeb3Network = useMemo(
    () =>
      debounce(() => {
        checkNetwork(setIsSepoliaNetwork);
      }, 350),
    [web3.eth.net] //eslint-disable-line
  );

  // Вызов функции подписки на изменение сети
  const subscribeToWeb3NetworkChanges = useMemo(
    () =>
      debounce(() => {
        subscribeToNetworkChanges(setIsSepoliaNetwork);
      }, 350),
    [web3.eth.net] //eslint-disable-line
  );

  useEffect(checkWeb3Network, []); //eslint-disable-line
  useEffect(subscribeToWeb3NetworkChanges, []); //eslint-disable-line

  const { loadBlockchainData } = useCommonActions();
  if (window.ethereum) {
    return (
      <>
        <div className="App">

          <Header
            isSepoliaNetwork={isSepoliaNetwork}
            changeNetworkAndConnect={changeNetworkAndConnect}
          />
          <Container maxWidth="sm" sx={{ height: '100%' }}>
            {isAuth ? (
              <Meta
                isSepoliaNetwork={isSepoliaNetwork}
                changeNetworkAndConnect={changeNetworkAndConnect}
              />
            )
              : (
                <>
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    {!isSepoliaNetwork && <Typography color="red" children={'Switch to Sepolia Ethereum newtwork.'} />}
                    <Button
                      onClick={loadBlockchainData}
                      variant="contained"
                      children="Connect MetaMask"
                      disabled={!isSepoliaNetwork}
                    />

                    {!isSepoliaNetwork && (
                      <Button
                        children="Connect Sepolia"
                        onClick={changeNetworkAndConnect}
                        variant="outlined"
                      />
                    )}
                  </Box>
                </>
              )}
          </Container>
        </div>
        <ToastContainer />
      </>
    );
  }
   
  return (
    <div className="App">
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', 
          height: '100%', 
        }}
      >
        <Typography
          color="red"
          children={'MetaMask not found. Please install MetaMask and connect to the Sepolia network.'}
        />
      </Container>
    </div>
  );
}

export default App;
