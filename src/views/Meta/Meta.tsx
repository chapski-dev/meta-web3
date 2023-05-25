import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Liquidity, Swap } from './components';
import { useSelector } from 'react-redux';
import * as commonSelector from '../../store/common/selectors';
import Web3 from 'web3';

export const Meta = () => {
  const [value, setValue] = React.useState('1');
  const web3 = new Web3(window.ethereum);

  const account = useSelector(commonSelector.accountAddress);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (!account && !web3) {
    return null;
  }
  
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
            <Swap />
          )}
        />
        <TabPanel
          value="2"
          children={(
            <Liquidity />
          )}
        />
      </TabContext>
    </>
  );
};

