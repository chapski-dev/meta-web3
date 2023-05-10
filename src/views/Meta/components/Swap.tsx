/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Box, SelectChangeEvent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { LoadingButton } from '@mui/lab';
import { Card, TokensSelect, WhiteInputCard } from '../../../components';
import { Formik, Form } from 'formik';
import { Token, Fetcher, Route, Trade, TokenAmount, TradeType } from '@uniswap/sdk';

import Web3 from 'web3';
import BN from 'bn.js';
import { CurrencyField } from './CurrencyField';
import uniswapRouterABI from '../../../uniswapRouterABI.json';
import { useDebounce } from '../../../hooks';
import { handleCatchError } from '../../../utils/error-handler';

import factoryABI from '../../../abi/UniswapV2Factory.sol/UniswapV2Factory.json';
import routerABI from '../../../abi/UniswapV2Router02.sol/UniswapV2Router02.json';
import erc20ABI from '../../../abi/erc20.abi.json';
import IUniswapV2PairABI from '../../../abi/IUniswapV2Pair.sol/IUniswapV2Pair.json';

import { UniswapV2Router02 } from 'additional/contracts/periphery';
import { UniswapV2Factory } from 'additional/contracts/core';
import { Contract } from 'ethers';

const factoryAddress = '0x3eEfE6F34Ab7DB9c37De5246959C8409d5F96CDB';
const routerAddress = '0x4f42048C40671b98be16176C9D020D03F30A2Dc4';

const pairAddress = '0xB5A0Fd8b301D1E57cDe55047B54210449038f4Be';

const Token_A = '0x2A1000293467a221F5d4cA98F4b7912c4c9c22b3';
const Token_B = '0x12467bCfc2bEded31A27927C45a49ecC9a22f524';

const provider = window.ethereum;

interface IProps {
  web3: Web3;
  account: string;
  balance: string;
}

type TCurrency = 'MATIC' | 'ETH';

export const Swap = ({
  account,
  balance,
  web3,
}: IProps) => {
  const [fromAmount, setFromAmount] = useState(''); // количество токена, который нужно обменять
  const [toAmount, setToAmount] = useState(''); // количество токена, который нужно получить
  const [currencyFrom, setCurrencyFrom] = useState('MATIC'); // адрес токена, который нужно обменять
  const [currencyTo, setCurrencyTo] = useState('ETH'); // адрес токена, который нужно получить

  const [routerContract, setRouterContract] = useState<any | null>(null);
  const [factoryContract, setFactoryContract] = useState<any | null>(null);
  const [pairContract, setPairContract] = useState<any | null>(null);
  const [loading, setLoading] = useState(false); // флаг загрузки

  const [isZeroBalance, setIsZeroBalance] = useState(false);

  const handleSwap = async () => {
    if (balance === '0') {
      setIsZeroBalance(true);
      return;
    }

    setLoading(true);

    try {
      const routerMeth: UniswapV2Router02 = routerContract.methods;
      const factoryMeth: UniswapV2Factory = factoryContract;
      let reserveIn;
      let reserveOut;

      await pairContract.methods.getReserves().call((error, result) => {
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
      ).call();

      console.log('amountOut', amountOut);
      
      // Наш кошелек, откуда мы будем отправлять токены A
      const from = account;

      // Адрес контракта токена A
      const tokenA = new web3.eth.Contract(erc20ABI as any, Token_A);

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
        [Token_A, Token_B],
        from,
        Date.now() + 1000 * 60 * 10, // Время, до которого транзакция должна быть выполнена
      ).send({ from });
    } catch (error) {
      handleCatchError(error);
    }
    
    //   try {

    //     const path = [Token_A, Token_B];

    //     const amountOutMin = 0;
    //     const to = web3.eth.defaultAccount;

    //     const tx = uniswapRouter.methods.swapExactTokensForTokens(
    //       amountToSend,
    //       amountOutMin,
    //       [Token_A, Token_B],
    //       web3.eth.defaultAccount,
    //       deadline,
    //       [amountToSend, 0], // amountADesired, amountBDesired
    //       to,
    //       deadline,
    //     );

    //     const gas = await tx.estimateGas({ from: web3.eth.defaultAccount });
    //     const gasPrice = await web3.eth.getGasPrice();
    //     const gasCost = new BN(gas).mul(new BN(gasPrice));
    //     const maxOutputAmount = outputAmountObj.multiply(new BN(99).toString()).divide(new BN(100).toString());
    //     const minOutputAmount = outputAmountObj.multiply(new BN(101).toString()).divide(new BN(100).toString());

    //     if (maxOutputAmount.lessThan(outputAmountObj) || minOutputAmount.greaterThan(outputAmountObj)) {
    //       alert('Slippage too high');
    //     } else {
    //       const gasLimit = new BN(gas).mul(new BN(120)).div(new BN(100));
    //       const txData = tx.encodeABI();

    //       const transactionParameters = {
    //         gasPrice: web3.utils.toHex(gasPrice),
    //         gasLimit: web3.utils.toHex(gasLimit),
    //         to: uniswapRouterAddress,
    //         from: web3.eth.defaultAccount as string,
    //         data: txData,
    //       };

    //       try {
    //         const txHash = await web3.eth.sendTransaction(transactionParameters);
    //         alert(`Swap executed with transaction hash: ${txHash}`);
    //       } catch (error: any) {
    //         handleCatchError(error);
    //         alert(`Swap failed: ${error.message}`);
    //       }
    //     }
    //   } catch (error: any) {
    //     handleCatchError(error);
    //     alert(`Swap failed: ${error.message}`);
    //   }
    setLoading(false);
  };

  const debouncedFrom = useDebounce<string>(fromAmount, 600);

  useEffect(() => {
    const handleInputAmountChange = async () => {
      setLoading(true);
      try {
        const router = new web3.eth.Contract(routerABI.abi as any, routerAddress);
        setRouterContract(router);
        const factory = new web3.eth.Contract(factoryABI.abi as any, factoryAddress);
        setFactoryContract(factory);

        const routerMeth: UniswapV2Router02 = router.methods;
        const factoryMeth: UniswapV2Factory = factory.methods;

        const pair = new web3.eth.Contract(IUniswapV2PairABI.abi as any, pairAddress);
        setPairContract(pair);

        let reserveIn;
        let reserveOut;

        await pair.methods.getReserves().call((error, result) => {
          if (error) {
            handleCatchError(error);
            return;
          }

          reserveIn = result[0];
          reserveOut = result[1];

          console.log(`ReserveIn: ${result[0]}`);
          console.log(`ReserveOut: ${result[1]}`);
        });

        // Количество токенов A для свопа
        const amountIn = web3.utils.toWei(fromAmount, 'ether');

        // Получение цены токена B для расчета количества токенов B, которые мы получим
        // const amountsOut = await routerMeth.getAmountsOut(amountIn, [Token_A, Token_B]).call();
        // console.log('amountsOut', amountsOut);

        const amountOut = await routerMeth.getAmountOut(
          amountIn,
          reserveIn,
          reserveOut,
        ).call();

        console.log('amountOut ==>', amountOut);

        // const amountOut2: string = amountsOut[1];
        // console.log('amountOut2', amountOut2);

        setToAmount((Number(amountOut) / 10 ** 18).toFixed(6));
      } catch (error) {
        handleCatchError(error);
      }
      setLoading(false);
    };
    if (debouncedFrom) {
      handleInputAmountChange();
    }
  }, [debouncedFrom]);

  const handleChangeCurrency = (event: SelectChangeEvent) => {
    const value = event.target.value as TCurrency;

    switch (value) {
      case 'MATIC':
        if (currencyFrom === 'MATIC') {
          setCurrencyFrom('ETH');
          setCurrencyTo('MATIC');
        } else {
          setCurrencyFrom('MATIC');
          setCurrencyTo('ETH');
        }
        break;

      case 'ETH':
        if (currencyFrom === 'ETH') {
          setCurrencyFrom('MATIC');
          setCurrencyTo('ETH');
        } else {
          setCurrencyFrom('ETH');
          setCurrencyTo('MATIC');
        }
        break;
    }
  };

  return (
    <Formik
      initialValues={{ name: '', email: '' }}
      onSubmit={handleSwap}
      // onSubmit={async () => null}
    >
      <Form>
        <Card>
          <Typography
            variant="h6"
            children="Swap"
            textAlign="left"
          />
          <Typography
            color={'#9CA3AF'}
            children="Easy way to trade your tokens"
            textAlign="left"
            mb={'40px'}
          />
          <Box display="flex" flexDirection="column" gap={'20px'} mb={3}>
            <WhiteInputCard>
              <Box>

                <Typography
                  children="From"
                  fontSize={'14px'}
                  textAlign="left"
                />
                <CurrencyField
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={({ floatValue }) => setFromAmount(floatValue.toString())}
                />
              </Box>
              <TokensSelect
                value={currencyFrom}
                onChange={handleChangeCurrency}
              />
            </WhiteInputCard>

            <ArrowDownwardIcon sx={{ alignSelf: 'center' }} />

            <WhiteInputCard>
              <Box>
                <Typography
                  children="To"
                  fontSize={'14px'}
                  textAlign="left"
                />
                <CurrencyField
                  placeholder="0.0"
                  value={toAmount}
                  onChange={({ floatValue }) => setToAmount(floatValue.toString())}
                  disabled
                />
              </Box>
              <TokensSelect
                value={currencyTo}
                onChange={handleChangeCurrency}
              />
            </WhiteInputCard>
          </Box>
          {isZeroBalance && <Typography color="red" children="Недостаточно средств" />}
          <LoadingButton
            variant="contained"
            children="SWAP Tokens"
            fullWidth
            size="large"
            type="submit"
            loading={loading}
            disabled={loading || !fromAmount || !toAmount}
          />
        </Card>
      </Form>
    </Formik>
  );
};
