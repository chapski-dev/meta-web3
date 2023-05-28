import { useEffect, useState } from 'react';
import { LiquidityView } from './Liquidity.view';
import { UniswapV2Router02 } from 'additional/contracts/periphery';

import erc20ABI from '../../../../abi/erc20.abi.json';

import { handleCatchError, notifySuccess } from '../../../../utils/error-handler';

import { useSelector } from 'react-redux';
import { CurrencyEnum, pairAddress, routerAddress, Token_A, Token_B } from '../../../../constants';
import Web3 from 'web3';

import * as commonSelector from '../../../../store/common/selectors';
import * as liquditySelector from '../../../../store/liquidity/selectors';
import { useLiquidityActions } from 'src/store/liquidity/actions';
import routerABI from 'src/abi/UniswapV2Router02.sol/UniswapV2Router02.json';
import UniswapV2PairABI from '../../../../abi/IUniswapV2Pair.sol/UniswapV2Pair.json';
import { useCommonActions } from 'src/store/common/actions';
import { useDebounce } from 'src/hooks';

export const Liquidity = () => {
  const web3 = new Web3(window.ethereum);
  const routerContract = new web3.eth.Contract(routerABI.abi as any, routerAddress);
  const pairContract = new web3.eth.Contract(UniswapV2PairABI.abi as any, pairAddress);

  const account = useSelector(commonSelector.accountAddress);

  const fromAmount = useSelector(liquditySelector.fromAmount); // количество токена, который нужно обменять
  const toAmount = useSelector(liquditySelector.toAmount); // количество токена, который нужно получить
  const currencyFrom = useSelector(liquditySelector.currencyFrom); // адрес токена, который нужно обменять
  const currencyTo = useSelector(liquditySelector.currencyTo); // адрес токена, который нужно получить
  const currencyFromAddr = useSelector(liquditySelector.currencyFromAddr); // адрес токена, который нужно обменять
  const currencyToAddr = useSelector(liquditySelector.currencyToAddr); // адрес токена, который нужно получить

  const {
    setFromAmount,
    setToAmount,
    setCurrencyFrom,
    setCurrencyTo,
    setCurrencyFromAddr,
    setCurrencyToAddr,
  } = useLiquidityActions();
  const { setBalance } = useCommonActions();

  const [loading, setLoading] = useState(false);
  const [showPoolLiqInfo, setShowPoolLiqInfo] = useState(false);

  const [liquidityBalance, setLiquidityBalance] = useState('');

  const handleChangeCurrencyA = (val: string) => {
    const value = val as CurrencyEnum;

    setCurrencyFrom(value);
    if (value === CurrencyEnum.tMATIC) {
      setCurrencyTo('tETH');
      setCurrencyToAddr(Token_A);
      setCurrencyFromAddr(Token_B);
    } else if (value === 'tETH') {
      setCurrencyTo(CurrencyEnum.tMATIC);
      setCurrencyToAddr(Token_B);
      setCurrencyFromAddr(Token_A);
    }
  };

  const handleChangeCurrencyB = (val: string) => {
    const value = val as CurrencyEnum;
    setCurrencyTo(value);
    if (value === CurrencyEnum.tMATIC) {
      setCurrencyFrom(CurrencyEnum.tETH);
      setCurrencyFromAddr(Token_A);
      setCurrencyToAddr(Token_B);
    } else if (value === CurrencyEnum.tETH) {
      setCurrencyFrom(CurrencyEnum.tMATIC);
      setCurrencyFromAddr(Token_B);
      setCurrencyToAddr(Token_A);
    }
  };
  useEffect(() => {
    pairContract.methods
      .balanceOf(account)
      .call()
      .then((res: any) => {
        setLiquidityBalance(web3.utils.fromWei(res, 'ether'));
      });
  }, []);

  const debouncedFrom = useDebounce<string>(fromAmount, 600);

  useEffect(() => {
    const getCurrencyVale = async () => {
      setLoading(true);
      try {
        const routerMeth: UniswapV2Router02 = routerContract.methods;
        let reserveIn;
        let reserveOut;
        await pairContract.methods.getReserves().call((error: any, result: any[]) => {
          if (error) {
            handleCatchError(error);
            return;
          }
          reserveIn = currencyFromAddr === Token_A ? result[0] : result[1];
          reserveOut = currencyFromAddr === Token_A ? result[1] : result[0];
        });
        const amountAToWei = web3.utils.toWei(debouncedFrom);
        // @ts-expect-error
        const amountBToWei = await routerMeth.quote(amountAToWei, reserveIn, reserveOut).call();
        setToAmount((Number(amountBToWei) / 10 ** 18).toFixed(6));
      } catch (error) {
        handleCatchError(error);
      }
      setLoading(false);
    };
    
    if (+debouncedFrom) {
      getCurrencyVale();
    } else {
      setToAmount('');
    }
  }, [debouncedFrom, currencyFromAddr, currencyToAddr]);
  
  if (!web3 || !routerContract || !pairContract) {
    return null;
  }
  
  const tokenA = new web3.eth.Contract(erc20ABI as any, currencyFromAddr);
  const tokenB = new web3.eth.Contract(erc20ABI as any, currencyToAddr);

  const from = account;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
  
  const addLiquidity = async () => {
    setLoading(true);
    try {
      const routerMeth: UniswapV2Router02 = routerContract.methods;

      // Convert the desired amounts to wei
      // const amountAToWei = web3.utils.toWei(fromAmount);
      // const amountBToWei = web3.utils.toWei(toAmount);

      let reserveIn;
      let reserveOut;
      
      await pairContract.methods.getReserves().call((error: any, result: any[]) => {
        if (error) {
          handleCatchError(error);
          return;
        }

        reserveIn = currencyFromAddr === Token_A ? result[0] : result[1];
        reserveOut = currencyFromAddr === Token_A ? result[1] : result[0];
      });
      const amountAToWei = web3.utils.toWei(fromAmount);
      // @ts-expect-error
      const amountBToWei = await routerMeth.quote(amountAToWei, reserveIn, reserveOut).call();
      setToAmount((Number(amountBToWei) / 10 ** 18).toFixed(6));
      
      // Get the current allowance for the router for the tokens
      const tokenAAllowance = await tokenA.methods.allowance(account, routerAddress).call();
      const tokenBAllowance = await tokenA.methods.allowance(account, routerAddress).call();
      
      if (tokenAAllowance < amountAToWei) {
        await tokenA.methods.approve(routerAddress, amountAToWei).send({ account });
      }
      if (tokenBAllowance < amountBToWei) {
        await tokenB.methods.approve(routerAddress, amountBToWei).send({ account });
      }
      // Add liquidity to the Uniswap pool
      await routerMeth.addLiquidity(
        Token_A,
        Token_B,
        amountAToWei,
        amountBToWei,
        web3.utils.toWei('0', 'ether'), // Minimum amount of LP tokens to receive
        web3.utils.toWei('0', 'ether'), // Address to send the LP tokens to, set to the wallet's address
        account,
        deadline,
      )
        // @ts-ignore
        .send({ from });

      const userLiquidityBalance = await pairContract.methods.balanceOf(account).call();
      setLiquidityBalance(web3.utils.fromWei(userLiquidityBalance, 'ether'));
      
      const balanceAcc = await web3.eth.getBalance(account);
      setBalance(balanceAcc);
      setFromAmount('');
      setToAmount('');
      notifySuccess('Tokens successfully added to the pool!');
    } catch (error) {
      handleCatchError(error);
    }
    setLoading(false);
  };

  const removeLiquidity = async () => {
    setLoading(true);
    try {
      // Получаем баланс ликвидности пользователя
      const userLiquidityBalance = await pairContract.methods.balanceOf(account).call();

      setLiquidityBalance(web3.utils.fromWei(userLiquidityBalance, 'ether'));
  
      // Выполняем удаление ликвидности
      await pairContract.methods
        .approve(routerAddress, userLiquidityBalance)
        .send({ from });

      const transaction = await routerContract.methods
        .removeLiquidity(
          Token_A, // Адрес первого токена из торговой пары
          Token_B, // Адрес второго токена из торговой пары
          userLiquidityBalance, // Количество ликвидности, которое хотим удалить
          web3.utils.toWei('0', 'ether'), // Минимальное количество токена 0, которое хотим получить
          web3.utils.toWei('0', 'ether'), // Минимальное количество токена 1, которое хотим получить
          account, // Адрес пользователя
          deadline,
        )
        .send({ from });
        
      notifySuccess('Транзакция выполнена: ' + transaction.transactionHash);
      pairContract.methods
        .balanceOf(account)
        .call()
        .then((res: any) => {
          setLiquidityBalance(web3.utils.fromWei(res, 'ether'));
        });

      console.log('transaction', transaction);
      console.log('Liquidity removed. Transaction hash:', transaction.transactionHash);
    } catch (error) {
      handleCatchError(error);
    }
    setLoading(false);
  };
  
  return (
    <LiquidityView
      setShowPoolLiqInfo={setShowPoolLiqInfo}
      loading={loading}
      fromAmount={fromAmount}
      setFromAmount={setFromAmount}
      currencyFrom={currencyFrom}
      currencyTo={currencyTo}
      handleChangeCurrencyA={handleChangeCurrencyA}
      handleChangeCurrencyB={handleChangeCurrencyB}
      toAmount={toAmount}
      showPoolLiqInfo={showPoolLiqInfo}
      liquidityBalance={liquidityBalance}
      setToAmount={setToAmount}
      addLiquidity={addLiquidity}
      removeLiquidity={removeLiquidity}
      web3={web3}
    />
  );
};

