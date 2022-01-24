import { useState, useEffect } from "react";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { getTokenImage } from "../../helpers";
import { useSelector } from "react-redux";
import { Link, SvgIcon, Popper, Paper, Typography, Divider, Box, Fade, Slide } from "@material-ui/core";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import cheez from "./cheez.png";

import "./cheezmenu.scss";
import { dai } from "src/helpers/AllBonds";
import { useWeb3Context } from "../../hooks/web3Context";

import CheezImg from "src/assets/tokens/cheez.png";
import sCheezImg from "src/assets/tokens/cheezstakedc.png";
import { Button } from 'react-bootstrap'
import { AiFillShopping } from 'react-icons/ai'

const addTokenToWallet = (tokenSymbol, tokenAddress) => async () => {
  if (window.ethereum) {
    const host = window.location.origin;
    let tokenPath;
    switch (tokenSymbol) {
      case "CHEEZ":
        tokenPath = CheezImg;
        break;
      default:
        tokenPath = sCheezImg;
    }
    const imageURL = `${host}/${tokenPath}`;

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: TOKEN_DECIMALS,
            image: "https://raw.githubusercontent.com/CatAndMouseDAO/branding/master/newlogo.png",
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
};

function CheezMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;
  const { chainID } = useWeb3Context();

  const networkID = chainID;

  const SOHM_ADDRESS = addresses[networkID].SOHM_ADDRESS;
  const OHM_ADDRESS = addresses[networkID].OHM_ADDRESS;

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = "cheez-popper";
  const daiAddress = dai.getAddressForReserve(networkID);

  const [byModal, setByModal] = useState();

  return (
    <Box
      component="div"
      // onMouseEnter={e => handleClick(e)}
      // onMouseLeave={e => handleClick(e)}
      id="cheez-menu-button-hover"
    >
      <Button id="cheez-menu-button" className="bg-dark by-cheese" size="large" variant="contained" color="secondary" aria-describedby={id} onClick={e => handleClick(e)}>
        <Typography><span className="cheez-menu">
          By Cheez</span></Typography>
      </Button>
      <Button id="cheez-menu-button" className="bg-dark3" size="large" variant="contained" color="secondary" aria-describedby={id} onClick={e => handleClick(e)}> 
        <Typography><span className="cheez-menu">
          < AiFillShopping /></span></Typography>
      </Button>



      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
        {({ TransitionProps }) => {
          return (
            <>
              <div className={`${!byModal ? "" : "d-block"} cheese-modal`}>
                <Link
                  href={`https://app.sushi.com/swap?inputCurrency=${daiAddress}&outputCurrency=0xBbD83eF0c9D347C85e60F1b5D2c58796dBE1bA0d`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button className="buy" onClick={e => handleClick(e)}>Buy on Sushiswap ↗️</Button>
                </Link>
                <p className="my-3">Add token to wallet</p>
                <div>
                  <Button className="yellow-box" onClick={addTokenToWallet("CHEEZ", OHM_ADDRESS)}>🧀CHEEZ</Button>
                  <Button className="yellow-box" onClick={addTokenToWallet("CHEEZ", OHM_ADDRESS)}>🧀sCHEEZ</Button>
                </div>
              </div>
            </>
            // <Fade {...TransitionProps} timeout={100}>
            //   <Paper className="cheez-menu" elevation={1}>
            //     <Box component="div" className="buy-tokens">
            //       <Link
            //         href={`https://app.sushi.com/swap?inputCurrency=${daiAddress}&outputCurrency=0xBbD83eF0c9D347C85e60F1b5D2c58796dBE1bA0d`}
            //         target="_blank"
            //         rel="noreferrer"
            //       >
            //         <Button size="large" variant="contained" color="secondary" fullWidth>
            //           <Typography align="left">
            //             Buy on Sushiswap <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
            //           </Typography>
            //         </Button>
            //       </Link>

            //     {isEthereumAPIAvailable ? (
            //       <Box className="add-tokens">
            //         <Divider color="secondary" />
            //         <p>ADD TOKEN TO WALLET</p>
            //         <Box display="flex" flexDirection="row" justifyContent="space-between">
            //           <Button variant="contained" color="secondary" style={{paddingBottom: "2%"}} onClick={addTokenToWallet("CHEEZ", OHM_ADDRESS)}>
            //             <img src={cheez} alt="cheez icon" style={{height: "20px", width: "20px"}} />
            //             <Typography variant="body1" style={{marginBottom: "3%"}}>CHEEZ</Typography>
            //           </Button>
            //           <Button variant="contained" color="secondary" style={{paddingBottom: "2%"}} onClick={addTokenToWallet("sCHEEZ", SOHM_ADDRESS)}>
            //             <img src={cheez} alt="cheez icon" style={{height: "20px", width: "20px"}} />
            //             <Typography variant="body1">sCHEEZ</Typography>
            //           </Button>
            //         </Box>
            //       </Box>
            //     ) : null}
            //     </Box>
            //   </Paper>
            // </Fade>

          );
        }}
      </Popper>
    </Box>
  );
}

export default CheezMenu;
