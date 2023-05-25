/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';

import { Formik } from 'formik';

import { useDebounce } from '../../../../hooks';
import { handleCatchError, notifySuccess } from '../../../../utils/error-handler';

import erc20ABI from '../../../../abi/erc20.abi.json';

import { UniswapV2Router02 } from 'additional/contracts/periphery';
import { SwapView } from './Swap.view';

import { useSelector } from 'react-redux';
import { useSwapActions } from '../../../../store/swap/actions';

import * as commonSelector from '../../../../store/common/selectors';
import * as swapSelector from '../../../../store/swap/selectors';
import { CurrencyEnum, pairAddress, routerAddress, Token_A, Token_B } from '../../../../constants';
import Web3 from 'web3';
import routerABI from 'src/abi/UniswapV2Router02.sol/UniswapV2Router02.json';
import UniswapV2PairABI from '../../../../abi/IUniswapV2Pair.sol/UniswapV2Pair.json';
import { useCommonActions } from 'src/store/common/actions';

export const Swap = () => {
  const web3 = new Web3(window.ethereum);
  const routerContract = new web3.eth.Contract(routerABI.abi as any, routerAddress);
  const pairContract = new web3.eth.Contract(UniswapV2PairABI.abi as any, pairAddress);

  const account = useSelector(commonSelector.accountAddress);
  const balance = useSelector(commonSelector.balance);

  const fromAmount = useSelector(swapSelector.fromAmount); // количество токена, который нужно обменять
  const toAmount = useSelector(swapSelector.toAmount); // количество токена, который нужно получить
  const currencyFrom = useSelector(swapSelector.currencyFrom); // адрес токена, который нужно обменять
  const currencyTo = useSelector(swapSelector.currencyTo); // адрес токена, который нужно получить
  const currencyFromAddr = useSelector(swapSelector.currencyFromAddr); // адрес токена, который нужно обменять
  const currencyToAddr = useSelector(swapSelector.currencyToAddr); // адрес токена, который нужно получить

  const {
    setFromAmount,
    setToAmount,
    setCurrencyFrom,
    setCurrencyTo,
    setCurrencyFromAddr,
    setCurrencyToAddr,
  } = useSwapActions();
  const { setBalance } = useCommonActions();
  // const [factoryContract, setFactoryContract] = useState<any | null>(null);
  const [loading, setLoading] = useState(false); // флаг загрузки

  const [isZeroBalance, setIsZeroBalance] = useState(false);

  const handleSwap = async () => {
    if (balance === '0') {
      setIsZeroBalance(true);
      return;
    }

    setLoading(true);
    if (!web3 || !routerContract || !pairContract) {
      return null;
    }
    try {
      const routerMeth: UniswapV2Router02 = routerContract.methods;
      // const factoryMeth: UniswapV2Factory = factoryContract;
      let reserveIn;
      let reserveOut;

      await pairContract.methods.getReserves().call((error: any, result: any[]) => {
        if (error) {
          handleCatchError(error);
          return;
        }
        reserveIn = result[0];
        reserveOut = result[1];
      });

      // Количество токенов A для свопа
      const amountIn = web3.utils.toWei(fromAmount, 'ether');

      // Получение цены токена B для расчета количества токенов B, которые мы получим
      const amountOut = await routerMeth.getAmountOut(
        amountIn,
        reserveIn,
        reserveOut,
        // @ts-ignore
      ).call();

      // Наш кошелек, откуда мы будем отправлять токены A
      const from = account;

      // Адрес контракта токена A
      const tokenA = new web3.eth.Contract(erc20ABI as any, currencyFromAddr);

      // Получение allowance для контракта роутера
      const allowance = await tokenA.methods.allowance(from, routerAddress).call();
      if (allowance < amountIn) {
        // Установка allowance, если он меньше, чем необходимо
        await tokenA.methods.approve(routerAddress, amountIn).send({ from });
      }

      // Обмен токенов A на B
      await routerMeth.swapExactTokensForTokens(
        amountIn,
        amountOut,
        [currencyFromAddr, currencyToAddr],
        from,
        Date.now() + 1000 * 60 * 10, // Время, до которого транзакция должна быть выполнена
        // @ts-ignore
      ).send({ from });
      const balanceAcc = await web3.eth.getBalance(account);
      setBalance(balanceAcc);
      notifySuccess('Tokens successfully swaped!');
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      handleCatchError(error);
    }
    setLoading(false);
  };

  const debouncedFrom = useDebounce<string>(fromAmount, 600);

  useEffect(() => {
    const handleInputAmountChange = async () => {
      if (debouncedFrom === '0') {
        return;
      }
      setLoading(true);
      try {
        if (!web3 || !routerContract || !pairContract) {
          return null;
        }
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

        // Количество токенов A для свопа
        const amountIn = web3.utils.toWei(debouncedFrom, 'ether');

        const amountOut: string = await routerMeth.getAmountOut(
          amountIn,
          reserveIn,
          reserveOut,
          // @ts-ignore
        ).call();

        setToAmount((Number(amountOut) / 10 ** 18).toFixed(6));
      } catch (error) {
        handleCatchError(error);
      }
      setLoading(false);
    };
    if (debouncedFrom) {
      handleInputAmountChange();
    }
  }, [currencyFromAddr, debouncedFrom]);

  const handleChangeCurrencyA = (val: string) => {
    const value = val as CurrencyEnum;
    if (currencyFrom === value) {
      return;
    }

    setCurrencyFrom(value);
    if (value === CurrencyEnum.TT_B) {
      setCurrencyTo(CurrencyEnum.TT_A);
      setCurrencyToAddr(Token_A);
      setCurrencyFromAddr(Token_B);
    } else if (value === CurrencyEnum.TT_A) {
      setCurrencyTo(CurrencyEnum.TT_B);
      setCurrencyToAddr(Token_B);
      setCurrencyFromAddr(Token_A);
    }
  };

  const handleChangeCurrencyB = (val: string) => {
    const value = val as CurrencyEnum;
    if (currencyTo === value) {
      return;
    }
    setCurrencyTo(value);
    if (value === CurrencyEnum.TT_B) {
      setCurrencyFrom(CurrencyEnum.TT_A);
      setCurrencyFromAddr(Token_A);
      setCurrencyToAddr(Token_B);
    } else if (value === CurrencyEnum.TT_A) {
      setCurrencyFrom(CurrencyEnum.TT_B);
      setCurrencyFromAddr(Token_B);
      setCurrencyToAddr(Token_A);
    }
  };

  return (
    <Formik
      initialValues={{ name: '', email: '' }}
      onSubmit={handleSwap}
    >
      <SwapView
        fromAmount={fromAmount}
        setFromAmount={setFromAmount}
        toAmount={toAmount}
        setToAmount={setToAmount}
        currencyFrom={currencyFrom}
        handleChangeCurrencyA={handleChangeCurrencyA}
        handleChangeCurrencyB={handleChangeCurrencyB}
        currencyTo={currencyTo}
        isZeroBalance={isZeroBalance}
        loading={loading}
      />
    </Formik>
  );
};
