import { AppBar, Toolbar, Box, SvgIcon, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ReactComponent as MenuIcon } from "../../assets/icons/hamburger.svg";
import CheezMenu from "./CheezMenu.jsx";
import ConnectMenu from "./ConnectMenu.jsx";
import { trim, shorten } from "../../helpers";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import { Typography } from "@material-ui/core";
import "./topbar.scss";
import { Button } from 'react-bootstrap'



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
    <AppBar position="sticky" className={classes.appBar} elevation={0}>
      <Toolbar disableGutters className="dapp-topbar">
        <Button className="ip-address">
          {address && (
            <Link href={`https://explorer.harmony.one/address/${address}`} target="_blank">
              <p variant="body1">
                {shorten(address)}
              </p>
            </Link>
          )}
        </Button>
        {/* <Button
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
        </Button> */}

        <div className="header">
          <div className="d-flex justify-content-between align-items-center">
            <div className="logo d-flex align-items-center">
              <img src={require('./logo.png').default} alt="" />
              <h1>Dashboard</h1>
            </div>
            <Box display="flex">
              {address && (
                <CheezMenu />
              )}
              <ConnectMenu theme={theme} handleDrawerToggle={handleDrawerToggle} />

            </Box>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
