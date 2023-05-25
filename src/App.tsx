import './App.css';
import { Meta } from './views';
import { Container } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { Header } from './components/Header';
import Web3 from 'web3';
import { useSelector } from 'react-redux';
import * as commonSelector from './store/common/selectors';
import { useEffect, useMemo, useState } from 'react';
import { handleCatchError, notifyError, notifySuccess, notifyWarning } from './utils/error-handler';
import debounce from 'lodash.debounce';

const web3 = new Web3(window.ethereum);

const checkNetwork = async (setIsSepoliaNetwork: (val: boolean) => void) => {
  try {
    const networkId = await web3.eth.net.getId();
    console.log('networkId', networkId);

    // Сеть Ethereum Sepolia имеет идентификатор 11155111
    if (networkId !== 11155111) {
      notifyError('Пользователь не подключен к сети Ethereum Sepolia.');
      setIsSepoliaNetwork(false);
    } else {
      setIsSepoliaNetwork(true);
    }
  } catch (error) {
    handleCatchError(error);
    notifyError('Ошибка при проверке сети');
  }
};
  // Подписка на изменение сети
const subscribeToNetworkChanges = (setIsSepoliaNetwork: (val: boolean) => void) => {
  window.ethereum.on('chainChanged', (chainId: any) => {
    if (chainId === '0xaa36a7') {
      notifySuccess('Пользователь переключился на сеть Ethereum Sepolia.');
      setIsSepoliaNetwork(true);
    } else {
      notifyWarning('Пользователь переключился на другую сеть Ethereum.');
      setIsSepoliaNetwork(false);
    }
  });
};

function App() {
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

  return (
    <>
      <div className="App">

        <Header 
          isSepoliaNetwork={isSepoliaNetwork}
        />
        {(isAuth && isSepoliaNetwork) && (
          <Container maxWidth="sm">
            <Meta />
          </Container>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
