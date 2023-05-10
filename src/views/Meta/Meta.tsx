import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Liquidity, Swap } from './components';
import Web3 from 'web3';

interface IProps {
  web3: Web3;
  account: string;
  balance: string;

}
export const Meta = ({
  web3,
  account,
  balance,
}:IProps) => {
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log('newValue', newValue);
    
    setValue(newValue);
  };
  return (
    <>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Swap" value="1" sx={{ flex: 1 }} />
            <Tab label="Liquidity" value="2" sx={{ flex: 1 }} />
          </TabList>
        </Box>
        <TabPanel
          value="1"
          children={(
            <Swap
              web3={web3}
              account={account}
              balance={balance}
            />
          )}
        />
        <TabPanel
          value="2"
          children={(
            <Liquidity
              web3={web3}
              account={account}
              balance={balance}
            />
          )}
        />
      </TabContext>
    </>
  );
};

