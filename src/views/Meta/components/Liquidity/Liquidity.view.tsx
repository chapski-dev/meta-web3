
import {
  Box,
  Button,
  Dialog,
  Link,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { Card, TokensSelect, WhiteInputCard } from '../../../../components';
import { CurrencyField } from '.././CurrencyField';
import { LoadingButton } from '@mui/lab';
import { handleCatchError } from '../../../../utils/error-handler';
import UniswapV2PairABI from '../../../../abi/IUniswapV2Pair.sol/UniswapV2Pair.json';
import Web3 from 'web3';
import { pairAddress } from '../../../../constants';

interface ILiquidityViewProps {
  setShowPoolLiqInfo: (val: boolean) => void;
  loading: boolean;
  fromAmount: string;
  setFromAmount: (val: string) => void;
  currencyFrom: string;
  handleChangeCurrencyA: (val: string) => void;
  handleChangeCurrencyB: (val: string) => void;
  toAmount: string;
  currencyTo: string;
  showPoolLiqInfo: boolean;
  liquidityBalance: string;
  setToAmount: (val: string) => void;
  addLiquidity: () => Promise<void>;
  removeLiquidity: () => Promise<void>;
  web3: Web3;

}

export const LiquidityView: FC<ILiquidityViewProps> = ({
  setShowPoolLiqInfo,
  loading,
  fromAmount,
  toAmount,
  setFromAmount,
  currencyFrom,
  handleChangeCurrencyA,
  handleChangeCurrencyB,
  currencyTo,
  showPoolLiqInfo,
  liquidityBalance,
  addLiquidity,
  removeLiquidity,
  web3,
}) => (
  <>
    <Box gap="20px" display="flex" flexDirection="column">
      <Card sx={{ p: '36px', bgcolor: '#E5E7EB' }} elevation={3}>
        <Typography
          variant="h6"
          children={`Add Liqudity to ${currencyFrom}\\${currencyTo}`}
          textAlign="left"
        />
        <Box color={'#9CA3AF'} mb={'40px'} textAlign="left">
          PDEX will uses cold funds on Proof of Stake to increase APR.
          <Link
            children="Pool info"
            onClick={() => setShowPoolLiqInfo(true)}
          />
        </Box>

        <Box display="flex" flexDirection="column" gap={'20px'} mb={3}>
          <WhiteInputCard>
            <Box>
              <CurrencyField
                placeholder="0.0"
                value={fromAmount}
                onChange={({ floatValue }) => {
                  setFromAmount(floatValue.toString());
                }}
              />
            </Box>
            <TokensSelect
              value={currencyFrom}
              onChange={handleChangeCurrencyA}
            />
          </WhiteInputCard>

          <WhiteInputCard>
            <Box>
              <CurrencyField
                placeholder="0.0"
                value={toAmount}
                disabled
              />
            </Box>

            <TokensSelect
              value={currencyTo}
              onChange={handleChangeCurrencyB}
            />
          </WhiteInputCard>
        </Box>
        <LoadingButton
          variant="contained"
          children="Add Liqudity"
          fullWidth
          size="large"
          onClick={addLiquidity}
          disabled={loading || !(fromAmount && toAmount)}
          loading={loading}
        />
      </Card>

      {!!+liquidityBalance && (
        <Card
          style={{
            pb: '25px',
          }}
        >
          <Typography
            align="center"
            children={`Common liquidity balance: ${liquidityBalance}`}
          />
          <WhiteInputCard>
            <Box display="flex" justifyContent="space-between" flex={1}>
              <Box>
                <Typography children="Total APR" />
                0.0
              </Box>
              <Box>
                <Typography children="SWOP APR" />
                0.0
              </Box>
              <Box>
                <Typography children="PoS APR" />
                0.0
              </Box>
            </Box>
          </WhiteInputCard>
          <LoadingButton
            loading={loading}
            disabled={loading}
            size="small"
            children="Remove Liqudity"
            onClick={removeLiquidity}
          />
        </Card>
      )}
    </Box>

    <PoolInfoModal
      web3={web3}
      open={showPoolLiqInfo}
      handleClose={() => setShowPoolLiqInfo(false)}
    />
  </>
);

interface IPoolInfoModalProps {
  open: boolean;
  handleClose: () => void;
  web3: Web3;
}

const PoolInfoModal = ({
  open,
  handleClose,
  web3,
}: IPoolInfoModalProps) => {
  const [tvl, setTvl] = useState('0');
  const [activeAssets, setActiveAssets] = useState('0');
  const [PoSAssets, setPoSAssets] = useState('0');

  useEffect(() => {
    getPoolTokenAmounts();
    getActiveReserves();
    getPassiveReserves();
  }, []);
  
  const pairContract = new web3.eth.Contract(UniswapV2PairABI.abi as any, pairAddress); 
  
  const getPoolTokenAmounts = async () => {
    try {
      // Получаем информацию о резервах токенов в пуле
      const reserves = await pairContract.methods.getReserves().call();

      // Разбираем полученные значения резервов
      const tokenAReserve = reserves[0];
      const tokenBReserve = reserves[1];

      // Возвращаем общее количество токенов в пуле
      setTvl(Number(web3.utils.fromWei(tokenAReserve + tokenBReserve, 'ether')).toFixed(1));
    } catch (error) {
      handleCatchError(error);
    }
  };

  const getActiveReserves = async () => {
    try {
      // Получаем информацию о резервах токенов в пуле
      const activeReserves = await pairContract.methods.getActiveReserves().call();

      const tokenAReserve = activeReserves[0];
      const tokenBReserve = activeReserves[1];

      setPoSAssets(Number(web3.utils.fromWei(tokenAReserve + tokenBReserve, 'tether')).toFixed(1));
    } catch (error) {
      handleCatchError(error);
    }
  };

  const getPassiveReserves = async () => {
    try {
      // Получаем информацию о резервах токенов в пуле
      const passiveReserves = await pairContract.methods.getPassiveReserves().call();

      const tokenAReserve = passiveReserves[0];
      const tokenBReserve = passiveReserves[1];

      setActiveAssets(Number(web3.utils.fromWei(tokenAReserve + tokenBReserve, 'ether')).toFixed(1));
    } catch (error) {
      handleCatchError(error);
    }
  };
  
  if (!open) {
    return null;
  }

  return (
    <Dialog
      onClose={() => handleClose()}
      open={open}
      fullWidth
    >
      <Card sx={{ p: '36px', bgcolor: '#E5E7EB' }} elevation={3}>
        <Typography
          variant="h6"
          children="tETH\tMATIC"
          mb={3}
        />

        <Box display="flex" flexDirection="column" gap={3} mb={4}>
          <Box display="flex" justifyContent="space-between">
            <Typography children={'TVL'} />
            <Typography children={tvl} />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography children={'Active Assets'} />
            <Typography children={activeAssets} />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography children={'PoS Assets'} />
            <Typography children={PoSAssets} />
          </Box>
          {poolInfo.map((el) => (
            <Box key={el.name} display="flex" justifyContent="space-between">
              <Typography children={el.name} />
              <Typography children={el.value} />
            </Box>
          ))}
        </Box>

        <Button
          variant="contained"
          children="Back"
          fullWidth
          size="large"
          onClick={() => handleClose()}
        />
      </Card>
    </Dialog>
  );
};
const poolInfo = [
  {
    name: 'Volume (24h)',
    value: '-',
  },
  {
    name: 'Fees (24h)',
    value: '-',
  },
  {
    name: 'APR',
    value: '-',
  },
];
