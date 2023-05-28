import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import * as commonSelector from '../../store/common/selectors';
import Web3 from 'web3';

interface IProps {
  isSepoliaNetwork: boolean; 
  changeNetworkAndConnect: () => Promise<void>;
}
export const Header: React.FC<IProps> = ({ isSepoliaNetwork, changeNetworkAndConnect }) => {
  const web3 = new Web3(window.ethereum);
  const account = useSelector(commonSelector.accountAddress);
  const balance = useSelector(commonSelector.balance);
  
  const isAuth = !!account && !!web3;

  return (
    <>
      {isAuth && (
        <Box sx={{ flexGrow: 1, mb: '60px' }}>
          <AppBar position="static">
            <Toolbar sx={{ justifyContent: 'space-evenly' }}>
              <Box sx={{ textAlign: 'left' }}>
                <Typography color="#fff" children={`Acc address: ${account}`} />
                <Typography color="#fff" children={`Balance: ${web3?.utils.fromWei(balance, 'ether')}ETH`} />
              </Box>
            </Toolbar>
          </AppBar>
        </Box>
      )}

    </>
  );
};
