import { ThemeProvider } from "@material-ui/core/styles";
import { useEffect, useState, useCallback } from "react";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Hidden, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import useTheme from "./hooks/useTheme";
import useBonds from "./hooks/Bonds";
import { useAddress, useWeb3Context } from "./hooks/web3Context";
import useGoogleAnalytics from "./hooks/useGoogleAnalytics";
import useSegmentAnalytics from "./hooks/useSegmentAnalytics";
import { storeQueryParameters } from "./helpers/QueryParameterHelper";

import { calcBondDetails } from "./slices/BondSlice";
import { loadAppDetails } from "./slices/AppSlice";
import { loadAccountDetails, calculateUserBondDetails } from "./slices/AccountSlice";

import { Stake, ChooseBond, Bond, Dashboard } from "./views";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import TopBar from "./components/TopBar/TopBar.jsx";
import NavDrawer from "./components/Sidebar/NavDrawer.jsx";
import Messages from "./components/Messages/Messages";
import NotFound from "./views/404/NotFound";
import SpawnDocs from "./views/Statistics/SpawnDocs";
import NFTs from "./views/NFTs/NFTs";
import Activity from "./views/Marketplace/Activity";
import NFTStaking from "./views/NFTStaking/NFTStaking";
import Play from "./views/Game/Play";
import Governance from "./views/Governance/Governance";
import WidgetBot from '@widgetbot/react-embed'
import MarketGate from './views/MarketGate/MarketGate';
import CheezPass from "./views/CheezPass/CheezPass";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Button } from "@material-ui/core"

import { dark as darkTheme } from "./themes/dark.js";

import "./style.scss";

// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// 🔭 block explorer URL
// const blockExplorer = targetNetwork.blockExplorer;

const drawerWidth = 280;
const transitionDuration = 969;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  trollbox: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: theme.spacing(1),
    marginLeft: "auto",
  },
  closeTrollbox: {
    position: "absolute",
    bottom: 370,
    right: 0,
    padding: theme.spacing(1),
    marginLeft: "auto",
  },
  openTrollbox: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: theme.spacing(1),
    marginLeft: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: transitionDuration,
    }),
    height: "100%",
    overflow: "auto",
    marginLeft: drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: transitionDuration,
    }),
    marginLeft: 0,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
}));

function App() {
  useGoogleAnalytics();
  useSegmentAnalytics();
  const dispatch = useDispatch();
  const [theme, toggleTheme, mounted] = useTheme();
  const location = useLocation();
  const classes = useStyles();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [trollboxOpen, setTrollboxOpen] = useState(false);
  const isSmallerScreen = useMediaQuery("(max-width: 1300px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const { connect, hasCachedProvider, provider, chainID, connected } = useWeb3Context();
  const address = useAddress();

  const [walletChecked, setWalletChecked] = useState(false);

  const isAppLoading = useSelector(state => state.app.loading);
  const isAppLoaded = useSelector(state => typeof state.app.marketPrice != "undefined"); // Hacky way of determining if we were able to load app Details.
  const { bonds } = useBonds();
  async function loadDetails(whichDetails) {
    let loadProvider = provider;

    if (whichDetails === "app") {
      loadApp(loadProvider);
    }

    // don't run unless provider is a Wallet...
    if (whichDetails === "account" && address && connected) {
      loadAccount(loadProvider);
    }
  }

  const loadApp = useCallback(
    loadProvider => {
      dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider }));
      bonds.map(bond => {
        dispatch(calcBondDetails({ bond, value: null, provider: loadProvider, networkID: chainID }));
      });
    },
    [connected],
  );

  const loadAccount = useCallback(
    loadProvider => {
      dispatch(loadAccountDetails({ networkID: chainID, address, provider: loadProvider }));
      bonds.map(bond => {
        dispatch(calculateUserBondDetails({ address, bond, provider, networkID: chainID }));
      });
    },
    [connected],
  );

  useEffect(() => {
    if (hasCachedProvider()) {
      connect().then(() => {
        setWalletChecked(true);
      });
    } else {
      setWalletChecked(true);
    }

    storeQueryParameters();
  }, []);

  useEffect(() => {
    if (walletChecked) {
      loadDetails("app");
    }
  }, [walletChecked]);

  useEffect(() => {
    if (connected) {
      loadDetails("account");
    }
  }, [connected]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarExpanded(false);
  };

  const toggleTrollbox = () => {
    setTrollboxOpen(!trollboxOpen);
  };

  useEffect(() => {
    if (isSidebarExpanded) handleSidebarClose();
  }, [location]);

  return (
    <ThemeProvider theme={darkTheme}>
      {location.pathname === '/' && <><img className="cartoon" src={require('./assets/images/main/cartoon.png').default} alt="" /></>}
      {location.pathname === '/dashboard' && <><img className="cartoon" src={require('./assets/images/main/cartoon.png').default} alt="" /></>}
      {location.pathname === '/play' && <><img className="cartoon2" src={require('./assets/images/main/cartoon.png').default} alt="" /></>}
      {location.pathname === '/ageing' && <><img className="cartoon3" src={require('./assets/images/main/cartoon.png').default} alt="" /></>}
      {location.pathname === '/nfts' && <><img className="cartoon4" src={require('./assets/images/main/cartoon.png').default} alt="" /></>}
      {location.pathname === '/marketplace' && <><img className="cartoon5" src={require('./assets/images/main/cartoon.png').default} alt="" /></>}
      {location.pathname === '/bridge' && <><img className="cartoon" src={require('./assets/images/main/cartoon.png').default} alt="" /></>}
      {location.pathname === '/bonds' && <><img className="cartoon5" src={require('./assets/images/main/cartoon.png').default} alt="" /></>}
      {location.pathname === '/governance' && <><img className="cartoon6" src={require('./assets/images/main/cartoon.png').default} alt="" /></>}

      <CssBaseline />
      <div className={`app ${isSmallerScreen && "tablet"} ${isSmallScreen && "mobile"} ${theme}`}>
        <Messages />
        <TopBar theme={theme} toggleTheme={toggleTheme} handleDrawerToggle={handleDrawerToggle} />
        <nav className={classes.drawer}>
          {isSmallerScreen ? (
            <NavDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
          ) : (
            <Sidebar />
          )}
        </nav>

        <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`}>
          <Switch>
            <Route exact path="/dashboard">
              <Dashboard />
            </Route>

            {/* <Route exact path="/">
              <Redirect to="/splash" />
            </Route>  

            <Route exact path="/splash">
              <SplashTime />
            </Route> */}

            <Route exact path="/">
              <Redirect to="/dashboard" />
            </Route>

            <Route path="/ageing">
              <Stake />
            </Route>

            <Route path="/genstatus">
              <SpawnDocs />
            </Route>

            <Route path="/nfts">
              <NFTs />
            </Route>

            <Route path="/cheezpass">
              <CheezPass />
            </Route>

            <Route path="/marketplace/:item?">
              <Activity />
            </Route>

            <Route path="/nftstaking">
              <NFTStaking />
            </Route>

            <Route path="/play">
              <Play />
            </Route>

            <Route path="/governance">
              <Governance />
            </Route>

            <Route path="/bonds">
              {bonds.map(bond => {
                return (
                  <Route exact key={bond.name} path={`/bonds/${bond.name}`}>
                    <Bond bond={bond} />
                  </Route>
                );
              })}
              <ChooseBond />
            </Route>

            <Route component={NotFound} />
          </Switch>
        </div>
        <div className={classes.trollbox}>
          {isSmallerScreen || !trollboxOpen ? (
            <></>
          ) : (
            <WidgetBot
              height="400px"
              width="600px"
              server="912505477433294868"
              channel="920042358790291487"
              shard="https://emerald.widgetbot.io"
            />
          )}
        </div>
        <div className={classes.closeTrollbox}>
          {isSmallerScreen || !trollboxOpen ? (
            <></>
          ) : (
            <Button onClick={toggleTrollbox}>__</Button>
          )}
        </div>
        <div className={classes.openTrollbox}>
          {isSmallerScreen || trollboxOpen ? (
            <></>
          ) : (
            <Button color="primary" onClick={toggleTrollbox}><img className="chat" src={require('./assets/images/main/chat.png').default} alt="" /></Button>
          )}
        </div>

      </div>

    </ThemeProvider>
  );
}

export default App;
