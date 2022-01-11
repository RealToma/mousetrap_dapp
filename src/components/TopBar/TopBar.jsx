import { AppBar, Toolbar, Box, Button, SvgIcon, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ReactComponent as MenuIcon } from "../../assets/icons/hamburger.svg";
import CheezMenu from "./CheezMenu.jsx";
import ConnectMenu from "./ConnectMenu.jsx";
import "./topbar.scss";
import { trim, shorten } from "../../helpers";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      padding: "10px",
    },
    justifyContent: "flex-end",
    alignItems: "flex-end",
    background: "transparent",
    backdropFilter: "none",
    zIndex: 10,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("981")]: {
      display: "none",
    },
  },
}));

function TopBar({ theme, toggleTheme, handleDrawerToggle }) {
  const classes = useStyles();
  const isVerySmallScreen = useMediaQuery("(max-width: 355px)");
  const address = useAddress();

  return (
    // <>
    //   <div className="header">
    //     <div className="d-flex align-items-center justify-content-between">
    //       <div className="logo d-flex align-items-center">
    //         <img src={require('./logo.png').default} alt="" />
    //         <h1>Dashboard</h1>
    //       </div>
    //       <div className="d-flex align-items-center gap">
    //         {/* <Button className="connect">Connect wallet  */}
    //         <ConnectMenu theme={theme} />
    //         {/* </Button> */}
    //         <Button className="connect2">Qqqq</Button>
    //         <Button className="toggle">aa</Button>
    //       </div>
    //     </div>
    //   </div>
    // </>
    <AppBar position="sticky" className={classes.appBar} elevation={0}>
      <Toolbar disableGutters className="dapp-topbar">
        <Button>
      <Box display="flex">
          {address && (
            <div className="wallet-link">
              <Link href={`https://explorer.harmony.one/address/${address}`} target="_blank">
                <Typography variant="body1" style={{marginLeft: "5%", marginTop: ".5%"}}>
                {shorten(address)}
                </Typography>
              </Link>
            </div>
          )}
        </Box>
        </Button>
        <Button
          id="hamburger"
          aria-label="open drawer"
          edge="start"
          size="large"
          variant="contained"
          color="secondary"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <SvgIcon component={MenuIcon} />
        </Button>
          <ConnectMenu theme={theme} />
          hhh
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
