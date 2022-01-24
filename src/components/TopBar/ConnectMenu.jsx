import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Button, SvgIcon, Typography, Popper, Paper, Divider, Link, Slide, Fade } from "@material-ui/core";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as CaretDownIcon } from "../../assets/icons/caret-down.svg";
import { useWeb3Context } from "src/hooks/web3Context";
import { BsList } from 'react-icons/bs'
import { FaWallet } from 'react-icons/fa'
import Sidebar from '../../components/Sidebar/NavContent'
import { ReactComponent as MenuIcon } from "../../assets/icons/hamburger.svg";

import "./topbar.scss";

function ConnectMenu({ theme, handleDrawerToggle }) {
  const { connect, disconnect, connected, web3, chainID, address } = useWeb3Context();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConnected, setConnected] = useState(connected);
  const [isHovering, setIsHovering] = useState(false);

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  let buttonText = "Connect Wallet";
  let clickFunc = connect;

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  if (isConnected) {
    buttonText = "Disconnect";
    clickFunc = disconnect;
  }

  if (pendingTransactions && pendingTransactions.length > 0) {
    buttonText = "In progress";
    clickFunc = handleClick;
  }

  const open = Boolean(anchorEl);
  const id = open ? "cheez-popper-pending" : undefined;

  const primaryColor = theme === "light" ? "#49A1F2" : "#F8CC82";
  const buttonStyles =
    "pending-txn-container" + (isHovering && pendingTransactions.length > 0 ? "hovered-button deck " : "deck ") + (address ? "disconnect" : " by-cheese");

  const getEtherscanUrl = txnHash => {
    return chainID === 4 ? "https://rinkeby.etherscan.io/tx/" + txnHash : "https://etherscan.io/tx/" + txnHash;
  };

  useEffect(() => {
    if (pendingTransactions.length === 0) {
      setAnchorEl(null);
    }
  }, [pendingTransactions]);

  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <div
      onMouseEnter={e => (pendingTransactions && pendingTransactions.length > 0 ? handleClick(e) : null)}
      onMouseLeave={e => (pendingTransactions && pendingTransactions.length > 0 ? handleClick(e) : null)}
      className="wallet-menu"
      id="wallet-menu"
    >

      {/* <div className="header">
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo d-flex align-items-center">
            <img src={require('./logo.png').default} alt="" />
            <h1>Dashboard</h1>
          </div>
          <div className="d-flex align-items-center gap">
            <Button className="connect"
              onClick={clickFunc}
              onMouseOver={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              key={1}>
              {buttonText}
            </Button>
            <Button className="connect2"
              onClick={clickFunc}
              onMouseOver={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              key={1}><FaWallet /></Button>
           <Button className="toggle" onClick={() => setToggleMenu(!toggleMenu)}><BsList /></Button>
            { toggleMenu ? <Sidebar  /> : <></>}
            
          </div>
        </div>
      </div> */}

      <div className="d-flex align-items-center">
        <Button
          className={buttonStyles}
          variant="contained"
          color="secondary"
          size="large"
          style={pendingTransactions.length > 0 ? { color: primaryColor } : {}}
          onClick={clickFunc}
          onMouseOver={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          key={1}
        >
          <span className="cheez-menu">{buttonText}</span>
          {pendingTransactions.length > 0 && (
            <Slide direction="left" in={isHovering} {...{ timeout: 333 }}>
              <SvgIcon className="caret-down" component={CaretDownIcon} htmlColor={primaryColor} />
            </Slide>
          )}
        </Button>
        {/* <Button className="toggle" onClick={() => setToggleMenu(!toggleMenu)}><BsList /></Button> */}
        <Button
          id="hamburger"
          aria-label="open drawer"
          edge="start"
          size="large"
          variant="contained"
          color="secondary"
          onClick={handleDrawerToggle}
          className="toggle"
        >
          <SvgIcon component={MenuIcon} />
        </Button>
      </div>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-end" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="cheez-menu" elevation={1}>
                {pendingTransactions.map((x, i) => (
                  <Box key={i} fullWidth>
                    <Link key={x.txnHash} href={getEtherscanUrl(x.txnHash)} target="_blank" rel="noreferrer">
                      <Button size="large" variant="contained" color="secondary" fullWidth>
                        <Typography align="left">
                          {x.text} <SvgIcon component={ArrowUpIcon} />
                        </Typography>
                      </Button>
                    </Link>
                  </Box>
                ))}
                <Box className="add-tokens">
                  <Divider color="secondary" />
                  <Button
                  
                    size="large"F
                    variant="contained"
                    color="secondary"
                    onClick={disconnect}
                    style={{ marginBottom: "0px" }}
                    fullWidth
                  >
                    <Typography>Disconnect</Typography>
                  </Button>
                </Box>
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </div>
  );
}

export default ConnectMenu;
