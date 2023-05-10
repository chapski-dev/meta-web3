import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Link,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Card, TokensSelect, WhiteInputCard } from '../../../components';
import { useDebounce } from '../../../hooks';
import Web3 from 'web3';
import { CurrencyField } from './CurrencyField';

type TCurrency = 'MATIC' | 'ETH';

interface IProps {
  web3: Web3;
  account: string;
  balance: string;
}

export const Liquidity = ({
  web3,
  account,
  balance,
}: IProps) => {
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [currencyFrom, setCurrencyFrom] = useState<TCurrency>('MATIC');
  const [currencyTo, setCurrencyTo] = useState<TCurrency>('ETH');

  const [showPoolLiqInfo, setShowPoolLiqInfo] = useState(false);

  const [showPoolLiq, setShowPoolLiq] = useState(false);

  const debouncedFrom = useDebounce<string | undefined>(fromValue, 600);
  const debouncedCurrencyFrom = useDebounce<string | undefined>(currencyFrom, 600);

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

  const getExchangeRates = useCallback(async () => {
    setLoading(true);

    setLoading(false);
  }, [debouncedCurrencyFrom, debouncedFrom]);

  useEffect(() => {
    getExchangeRates();
  }, [getExchangeRates]);

  return (
    <>
      <Box gap="20px" display="flex" flexDirection="column">
        <Card sx={{ p: '36px', bgcolor: '#E5E7EB' }} elevation={3}>
          <Typography
            variant="h6"
            children="Add Liqudity to ETH\MATIC"
            textAlign="left"
          />
          <Box color={'#9CA3AF'} mb={'40px'} textAlign="left">
            PDEX will uses cold funds on Proof of Stake to increase APR.
            <Link
              children="Pool info"
              onClick={() => setShowPoolLiqInfo(true)}
            />
          </Box>

          {loading && <CircularProgress />}
          <Box display="flex" flexDirection="column" gap={'20px'} mb={3}>

            <WhiteInputCard>
              <Box>

                <CurrencyField
                  placeholder="0.0"
                  value={fromValue}
                  onChange={({ floatValue }) => setFromValue(floatValue.toString())}
                />
              </Box>
              <TokensSelect
                value={currencyFrom}
                onChange={handleChangeCurrency}
              />
            </WhiteInputCard>

            <WhiteInputCard>
              <Box>
                <CurrencyField
                  placeholder="0.0"
                  value={toValue}
                  onChange={({ floatValue }) => setToValue(floatValue.toString())}
                  disabled
                />
              </Box>

              <TokensSelect
                value={currencyTo}
                onChange={handleChangeCurrency}
              />
            </WhiteInputCard>
          </Box>
          <Button
            variant="contained"
            children="Add Liqudity"
            fullWidth
            size="large"
            onClick={() => setShowPoolLiq(true)}
          />
        </Card>

        {showPoolLiq && (

          <Card>
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

            <Button children="Remove Liqudity" onClick={() => setShowPoolLiq(false)} />
          </Card>
        )}
      </Box>

      <PoolInfoModal
        open={showPoolLiqInfo}
        handleClose={() => setShowPoolLiqInfo(false)}
      />
    </>
  );
};

interface IPoolInfoModalProps {
  open: boolean;
  handleClose: () => void;
}
const PoolInfoModal = ({
  open,
  handleClose,
}: IPoolInfoModalProps) => {
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
          children="ETH\MATIC"
          mb={3}
        />

        <Box display="flex" flexDirection="column" gap={3} mb={4}>
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
    name: 'TVL',
    value: '0.00',
  },
  {
    name: 'Active Assets',
    value: '0.00',
  },
  {
    name: 'PoS Assets',
    value: '0.00',
  },
  {
    name: 'Volume (24h)',
    value: '0.00',
  },
  {
    name: 'Fees (24h)',
    value: '0.00',
  },
  {
    name: 'APR',
    value: '0.00',
  },
];
