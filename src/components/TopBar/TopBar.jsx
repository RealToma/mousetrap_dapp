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
import { Button } from "react-bootstrap";
import { useLocation } from "react-router";

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
  let location = useLocation();

  const classes = useStyles();
  const isTablet = useMediaQuery("(min-width: 650px)");
  const address = useAddress();

  return (
    <AppBar position="sticky" className={classes.appBar} elevation={0}>
      <Toolbar disableGutters className="dapp-topbar">
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
              <img src={require("../../assets/images/logo.png").default} alt="" />
              <h1>
                {location.pathname === "/" && <>Dashboard</>}
                {location.pathname === "/dashboard" && <>Dashboard</>}
                {location.pathname === "/play" && <>The Maze</>}
                {location.pathname === "/ageing" && <>Ageing</>}
                {location.pathname === "/nfts" && <>My NFTs</>}
                {location.pathname === "/marketplace" && <>Marketplace</>}
                {location.pathname === "/bridge" && <>Bridge</>}
                {location.pathname === "/bonds" && <>Bond</>}
                {location.pathname === "/governance" && <>Governance</>}
              </h1>
            </div>
            <div className="wallet-connection d-flex align-items-end">
              {address && isTablet && (
                <Link href={`https://explorer.harmony.one/address/${address}`} target="_blank">
                  <h4 variant="body1" className="m-0">
                    {shorten(address)}
                  </h4>
                </Link>
              )}
              <div className="d-flex align-items-center" title={address && shorten(address)}>
                {address && <CheezMenu />}
                {address && !isTablet ? (
                  <Button size="large" variant="contained" color="secondary" className="disconnect" fullWidth>
                    <span className="cheez-menu">{shorten(address).slice(0, -4)}</span>
                  </Button>
                ) : (
                  <ConnectMenu theme={theme} handleDrawerToggle={handleDrawerToggle} />
                )}
              </div>
            </div>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
