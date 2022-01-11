import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./Social";
import externalUrls from "./externalUrls";
import { trim, shorten } from "../../helpers";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import useBonds from "../../hooks/Bonds";
import { Paper, Link, Box, Typography, SvgIcon } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import CheeseIcon from "./cheeseicon.png";
import BondIcon from "./bondicon.png";
import HomeIcon from "./homeicon.png";
import BeakerIcon from "./beakericon.png";
import StatusIcon from "./status.png";
import UnlockIcon from "./unlock.png";
import ShoppingIcon from "./shopping-cart-icon.png";
import Juggling from "./juggling.png";
import Factory from "./factory.png";
import Spinning from "./spinningLogo.gif"
import BridgeIcon from "./bridge.png";
import ControllerIcon from "./joystick.png";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./sidebar.scss";
import { Button } from "react-bootstrap";

function NavContent() {
  const [isActive] = useState();
  const address = useAddress();
  const { bonds } = useBonds();
  const { chainID } = useWeb3Context();

  const checkPage = useCallback((match, location, page) => {
    const currentPath = location.pathname.replace("/", "");
    if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
      return true;
    }
    if (currentPath.indexOf("ageing") >= 0 && page === "ageing") {
      return true;
    }
    if ((currentPath.indexOf("bonds") >= 0 || currentPath.indexOf("choose_bond") >= 0) && page === "bonds") {
      return true;
    }
    if ((currentPath.indexOf("genstatus") >= 0) && page === "genstatus") {
      return true;
    }
    if ((currentPath.indexOf("nfts") >= 0) && page === "nfts") {
      return true;
    }
    if ((currentPath.indexOf("marketplace") >= 0) && page === "marketplace") {
      return true;
    }
    if ((currentPath.indexOf("nftstaking") >= 0) && page === "nftstaking") {
      return true;
    }
    if ((currentPath.indexOf("play") >= 0) && page === "play") {
      return true;
    }
    return false;
  }, []);

  return (
    <>
      <Paper className="dapp-sidebar px-3 py-2">
        <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
          <div className="dapp-menu-top sidebar-center">

            <div className="dapp-menu-links">
              <div className="dapp-nav align-items-center" id="navbarNav">
                <Link
                  component={NavLink}
                  id="dash-nav"
                  to="/"
                  isActive={(match, location) => {
                    return checkPage(match, location, "dashboard");
                  }}
                  className={`button-dapp-menu sidebar-head py-2 px-3 ${isActive ? "active" : ""}`}
                >
                  <Typography variant="h4">
                    Dashboard
                  </Typography>
                </Link>

                <Link
                  component={NavLink}
                  id="stake-nav"
                  to="/play"
                  isActive={(match, location) => {
                    return checkPage(match, location, "play");
                  }}
                  className={`button-dapp-menu sidebar-head py-2 px-3 ${isActive ? "active" : ""}`}
                >
                  <Typography variant="h4">
                    Play
                  </Typography>
                </Link>

                <Link
                  component={NavLink}
                  id="stake-nav"
                  to="/ageing"
                  isActive={(match, location) => {
                    return checkPage(match, location, "ageing");
                  }}
                  className={`button-dapp-menu sidebar-head py-2 px-3 ${isActive ? "active" : ""}`}
                >
                  <Typography variant="h4">
                    Ageing
                  </Typography>
                </Link>
                {/* 
              <Link
                component={NavLink}
                id="spawn-nav"
                to="/nftstaking"
                isActive={(match, location) => {
                  return checkPage(match, location, "nftstaking");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
                style={{display: "flex", flexDirection: "row"}}
              >
                <img src={Factory} alt="factory icon" style={{height: "30px", marginRight: "5%"}} />
                <Typography variant="h4" style={{marginLeft: "5%", marginTop: ".5%"}}>
                  CHEEZ Factory
                </Typography>
              </Link> */}

                <Link
                  component={NavLink}
                  id="spawn-nav"
                  to="/nfts"
                  isActive={(match, location) => {
                    return checkPage(match, location, "nfts");
                  }}
                  className={`button-dapp-menu sidebar-head py-2 px-3 ${isActive ? "active" : ""}`}
                >
                  <Typography variant="h4">
                    My NFTs
                  </Typography>
                </Link>


                <Link
                  component={NavLink}
                  id="spawn-nav"
                  to="/marketplace"
                  isActive={(match, location) => {
                    return checkPage(match, location, "marketplace");
                  }}
                  className={`button-dapp-menu sidebar-head py-2 px-3 ${isActive ? "active" : ""}`}
                >
                  <Typography variant="h4">
                    Marketplace
                  </Typography>
                </Link>

                <Link
                  component={NavLink}
                  id="spawn-nav"
                  to="/bridge"
                  isActive={(match, location) => {
                    return checkPage(match, location, "marketplace");
                  }}
                  className={`button-dapp-menu sidebar-head py-2 px-3 ${isActive ? "active" : ""}`}
                >
                  <Typography variant="h4">
                    Bridge
                  </Typography>
                </Link>

                <Link
                  component={NavLink}
                  id="bond-nav"
                  to="/bonds"
                  isActive={(match, location) => {
                    return checkPage(match, location, "bonds");
                  }}
                  className={`button-dapp-menu sidebar-head py-2 px-3  ${isActive ? "active" : ""}`}
                >
                  <Typography variant="h4">
                    Bond
                  </Typography>
                </Link>

                <div className="dapp-menu-data discounts">
                  {/* <div className="bond-discounts">
                    <Typography variant="body2">Bond discounts</Typography>
                    {bonds.filter(b => b.isAvailable[chainID]).map((bond, i) => (
                      <Link component={NavLink} to={`/bonds/${bond.name}`} key={i} className={"bond"}>
                        {!bond.bondDiscount ? (
                          <Skeleton variant="text" width={"150px"} />
                        ) : (
                          <Typography variant="body2">
                            {bond.displayName}
                            <span className="bond-pair-roi">
                              {bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%
                            </span>
                          </Typography>
                        )}
                      </Link>
                    ))}
                  </div> */}

                  {/* <Link
                    id="bridge-nav"
                    href="https://synapseprotocol.com/?inputCurrency=USDC&outputCurrency=DAI&outputChain=1666600000"
                    target="_blank"
                    className={`button-dapp-menu ${isActive ? "active" : ""}`}
                    style={{ display: "flex", flexDirection: "row", marginTop: "8%" }}
                  >
                    <img src={BridgeIcon} alt="bridge icon" style={{ height: "25px", width: "25px", marginRight: "5%", marginTop: "2%" }} />
                    <Typography variant="h6" style={{ marginLeft: "5%", marginTop: "2%" }}>
                      Bridge
                    </Typography>
                  </Link> */}

                </div>
              </div>
            </div>
          </div>

          <div className="bond mt-2">
            <div className="bond-left">
              <span>Bond discounts</span>
              <h5>CHEEZ-DAI LP</h5>
            </div>
            <div className="bond-right">
              <span>3.15%</span>
            </div>
          </div>

          <Box className="dapp-menu-bottom" display="flex" justifyContent="space-between" flexDirection="column">
            {/* <div className="dapp-menu-external-links">
              {Object.keys(externalUrls).map((link, i) => {
                return (
                  <Link key={i} href={`${externalUrls[link].url}`} target="_blank">
                    <Typography variant="h6">{externalUrls[link].icon}</Typography>
                    <Typography variant="h6">{externalUrls[link].title}</Typography>
                  </Link>
                );
              })}
            </div> */}
            <div className="social">
              <div className="docs-btn">
                <Button>Docs</Button>
                <Button className="mt-3">Merch</Button>
              </div>
            </div>
            <Social />
          </Box>
        </Box>
      </Paper>

    </>
  );
}

export default NavContent;
