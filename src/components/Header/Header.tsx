import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Button, Typography } from '@mui/material';
import Web3 from 'web3';

interface IProps {
  web3: Web3 | null;
  account: string;
  isAuth: boolean;
  balance: string;
  loadBlockchainData: () => void;
  handleLogout: () => void;
}
export const Header: React.FC<IProps> = ({
  isAuth,
  web3,
  account,
  balance,
  loadBlockchainData,
  handleLogout,
}) => (
  <>
    {isAuth ? (
      <Box sx={{ flexGrow: 1, mb: '60px' }}>
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: 'space-evenly' }}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography color="#fff" children={`Acc address: ${account}ETH`} />
              <Typography color="#fff" children={`Balance: ${web3?.utils.fromWei(balance, 'ether')}ETH`} />
            </Box>
            <Button
              onClick={handleLogout}
              variant="outlined"
              children="Exit"
              sx={{ background: '#fff' }}
            />
          </Toolbar>
        </AppBar>
      </Box>

    ) : (

      <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button
          onClick={loadBlockchainData}
          variant="contained"
          children="Connect MetaMask"
        />
      </Box>
    )}

  </>
);
