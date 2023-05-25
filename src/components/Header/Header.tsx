import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import * as commonSelector from '../../store/common/selectors';
import { useCommonActions } from 'src/store/common/actions';
import Web3 from 'web3';

interface IProps {
  isSepoliaNetwork: boolean; 
}
export const Header: React.FC<IProps> = ({ isSepoliaNetwork }) => {
  const web3 = new Web3(window.ethereum);
  const account = useSelector(commonSelector.accountAddress);
  const balance = useSelector(commonSelector.balance);

  const { handleLogout, loadBlockchainData } = useCommonActions();
  
  const isAuth = !!account && !!web3;

  return (
    <>
      {isAuth ? (
        <Box sx={{ flexGrow: 1, mb: '60px' }}>
          <AppBar position="static">
            <Toolbar sx={{ justifyContent: 'space-evenly' }}>
              <Box sx={{ textAlign: 'left' }}>
                <Typography color="#fff" children={`Acc address: ${account}`} />
                <Typography color="#fff" children={`Balance: ${web3?.utils.fromWei(balance, 'ether')}ETH`} />
              </Box>
              <Button
                onClick={() => handleLogout()}
                variant="outlined"
                children="Exit"
                sx={{ background: '#fff' }}
              />
            </Toolbar>
          </AppBar>
        </Box>
      ) : (
        <Box
          sx={{ 
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {!isSepoliaNetwork && <Typography color="red" children={'Switch to Sepolia Ethereum newtwork.'} />}
          <Button
            onClick={() => loadBlockchainData()}
            variant="contained"
            children="Connect MetaMask"
            disabled={!isSepoliaNetwork}
          />
        </Box>
      )}

    </>
  );
};
