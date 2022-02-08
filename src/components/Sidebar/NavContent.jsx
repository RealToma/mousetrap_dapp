import { useCallback, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
import Spinning from "./spinningLogo.gif";
import BridgeIcon from "./bridge.png";
import ControllerIcon from "./joystick.png";
import BondPurchase from "../../views/Bond/BondPurchase";
import BondRedeem from "../../views/Bond/BondRedeem";
import BondLogo from "../../components/BondLogo";
import { Row, Col, Button, Modal, Tabs, Tab } from "react-bootstrap";
import { useSelector } from "react-redux";
import { formatCurrency } from "../../helpers";
import Slider from "react-slick";

import "bootstrap/dist/css/bootstrap.min.css";
import "./sidebar.scss";
// import {  useLocation } from 'react-router';

function NavContent({ mobileOpen, setMobileOpen }) {
  const [isActive] = useState();
  const address = useAddress();
  const { bonds } = useBonds();
  const { chainID } = useWeb3Context();

  const isBondLoading = useSelector(state => state.bonding.loading ?? true);

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
    if (currentPath.indexOf("genstatus") >= 0 && page === "genstatus") {
      return true;
    }
    if (currentPath.indexOf("nfts") >= 0 && page === "nfts") {
      return true;
    }
    if (currentPath.indexOf("marketplace") >= 0 && page === "marketplace") {
      return true;
    }
    if (currentPath.indexOf("nftstaking") >= 0 && page === "nftstaking") {
      return true;
    }
    if (currentPath.indexOf("play") >= 0 && page === "play") {
      return true;
    }
    return false;
  }, []);

  let location = useLocation();

  const [modalValue, setModalValue] = useState([]);

  const [modal1, setModal1] = useState(false);
  const Modal1Close = () => setModal1(false);
  const Modal1Open = () => setModal1(true);

  const [modal2, setModal2] = useState(false);
  const Modal2Close = () => setModal2(false);
  const Modal2Open = () => setModal2(true);

  const [slippage, setSlippage] = useState(0.5);
  const [recipientAddress, setRecipientAddress] = useState(address);

  const onRecipientAddressChange = e => {
    return setRecipientAddress(e.target.value);
  };

  useEffect(() => {
    if (address) setRecipientAddress(address);
  }, [address]);

  const onSlippageChange = e => {
    return setSlippage(e.target.value);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <>
      <div className={mobileOpen ? "sidebar-main m-0" : "sidebar-main"}>
        <div className="sidebar-con px-3">
          <Link
            component={NavLink}
            id="dash-nav"
            to="/"
            isActive={(match, location) => {
              return checkPage(match, location, "dashboard");
            }}
          >
            <Button
              style={{ justifyContent: "center" }}
              className={`${location.pathname === "/dashboard" ? "active" : ""} sidebar-head`}
            >
              <span className="mb-0">Dashboard</span>
            </Button>
          </Link>
          <Link
            component={NavLink}
            id="stake-nav"
            to="/play"
            isActive={(match, location) => {
              return checkPage(match, location, "play");
            }}
          >
            <Button
              style={{ justifyContent: "center" }}
              className={`${location.pathname === "/play" ? "active" : ""} sidebar-head`}
            >
              <span className="mb-0">Play</span>
            </Button>
          </Link>
          <Link
            component={NavLink}
            id="stake-nav"
            to="/ageing"
            isActive={(match, location) => {
              return checkPage(match, location, "ageing");
            }}
          >
            <Button
              style={{ justifyContent: "center" }}
              className={`${location.pathname === "/ageing" ? "active" : ""} sidebar-head`}
            >
              <span className="mb-0">Ageing</span>
            </Button>
          </Link>
          <Link
            component={NavLink}
            id="spawn-nav"
            to="/nfts"
            isActive={(match, location) => {
              return checkPage(match, location, "nfts");
            }}
          >
            <Button
              style={{ justifyContent: "center" }}
              className={`${location.pathname === "/nfts" ? "active" : ""} sidebar-head`}
            >
              <span className="mb-0">My NFTs</span>
            </Button>
          </Link>
          <Link
            component={NavLink}
            id="spawn-nav"
            to="/marketplace"
            isActive={(match, location) => {
              return checkPage(match, location, "marketplace");
            }}
          >
            <Button
              style={{ justifyContent: "center" }}
              className={`${location.pathname === "/marketplace" ? "active" : ""} sidebar-head`}
            >
              <span className="mb-0">Marketplace</span>
            </Button>
          </Link>
          <a
            href="https://synapseprotocol.com/?inputCurrency=USDC&outputCurrency=DAI&outputChain=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              style={{ justifyContent: "center" }}
              className={`${location.pathname === "/bridge" ? "active" : ""} sidebar-head`}
            >
              <span className="mb-0">Bridge</span>
            </Button>
          </a>
          <Link
            component={NavLink}
            id="bond-nav"
            to="/bonds"
            isActive={(match, location) => {
              return checkPage(match, location, "bonds");
            }}
          >
            <Button
              style={{ justifyContent: "center" }}
              className={`${location.pathname === "/bonds" ? "active" : ""} sidebar-head`}
            >
              <span className="mb-0">Bond</span>
            </Button>
          </Link>
          <Link
            component={NavLink}
            id="bond-nav"
            to="/governance"
            isActive={(match, location) => {
              return checkPage(match, location, "governance");
            }}
          >
            <Button
              style={{ justifyContent: "center" }}
              className={`${location.pathname === "/governance" ? "active" : ""} sidebar-head`}
            >
              <span className="mb-0">Governance</span>
            </Button>
          </Link>

          {/* slick slider =================== */}
          <div>
            <Slider {...settings}>
              {bonds
                .filter(b => b.isAvailable[chainID])
                .map((bond, i) => (
                  <div className="bond mt-3">
                    <div>
                      <div className="bond-left mb-2">
                        <span>Bond discounts</span>
                      </div>
                      <div
                        key={i}
                        onClick={() => {
                          Modal1Open(), setModalValue(bond);
                        }}
                      >
                        {!bond.bondDiscount ? (
                          <Skeleton variant="text" width={"150px"} />
                        ) : (
                          <div className="bond-right mt-2">
                            <h5 className="mb-0">{bond.displayName}</h5>
                            <span>{bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </Slider>
          </div>

          <div className="social mt-5">
            <div className="docs-btn">
              <Button>Docs</Button>
              <Button className="mt-3">Merch</Button>
            </div>
            <Social />
          </div>
        </div>
      </div>

      <Modal
        show={modal1}
        onHide={() => {
          Modal1Close(), setModalValue([]);
        }}
      >
        <Modal.Body className="modal-bond">
          <button
            style={{
              position: "absolute",
              right: "0",
              top: "-1px",
              height: "24px",
              width: "24px",
              background: "transparent",
              border: "none",
            }}
            onClick={Modal1Close}
          ></button>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex gap align-items-center">
              <BondLogo bond={modalValue} />
              <h3 className="mb-0">CHEEZ-DAI LP</h3>
            </div>
            <Button
              className="setting"
              onClick={() => {
                Modal1Close();
                Modal2Open();
              }}
            >
              <img src={require("./setting.svg").default} alt="" />
            </Button>
          </div>
          <Row className="mt-3">
            <Col lg={6} md={12} className="mt-3">
              <div className="bg-wight-bond">
                <span>Bond Price</span>
                <h3 className="mb-0">{isBondLoading ? <Skeleton /> : formatCurrency(modalValue.bondPrice, 2)}</h3>
              </div>
            </Col>
            <Col lg={6} md={12} className="mt-3">
              <div className="bg-wight-bond">
                <span>Market Price</span>
                <h3 className="mb-0">{isBondLoading ? <Skeleton /> : formatCurrency(modalValue.marketPrice, 2)}</h3>
              </div>
            </Col>
          </Row>

          <div className="maintabs mt-4">
            <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
              <Tab eventKey="home" title="Bond">
                <BondPurchase bond={modalValue} />
              </Tab>
              <Tab eventKey="profile" title="Redeem">
                <BondRedeem bond={modalValue} />
              </Tab>
            </Tabs>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={modal2} onHide={Modal2Close}>
        <Modal.Body className="setting-modal">
          <button
            style={{
              position: "absolute",
              right: "0",
              top: "-1px",
              height: "24px",
              width: "24px",
              background: "transparent",
              border: "none",
            }}
            onClick={Modal2Close}
          ></button>
          <h3>Settings</h3>
          <div>
            <span>Slippage</span>
            <input type="text" value={slippage} onChange={onSlippageChange} />
            <p>Transaction may revert if price changes by more than slippage %</p>
          </div>
          <div>
            <span>Recipient Address</span>
            <input type="text" value={recipientAddress} onChange={onRecipientAddressChange} />
            <p>Choose recipient address. By default, this is your currently connected address</p>
          </div>
        </Modal.Body>
      </Modal>

      {/* <Paper className="dapp-sidebar px-3 py-2">
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

                <Link
                  component={NavLink}
                  id="spawn-nav"
                  to="/nftstaking"
                  isActive={(match, location) => {
                    return checkPage(match, location, "nftstaking");
                  }}
                  className={`button-dapp-menu ${isActive ? "active" : ""}`}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <img src={Factory} alt="factory icon" style={{ height: "30px", marginRight: "5%" }} />
                  <Typography variant="h4" style={{ marginLeft: "5%", marginTop: ".5%" }}>
                    CHEEZ Factory
                  </Typography>
                </Link>

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
                  <div className="bond-discounts">
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
                  </div>

                  <Link
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
                  </Link>

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
            <div className="dapp-menu-external-links">
              {Object.keys(externalUrls).map((link, i) => {
                return (
                  <Link key={i} href={`${externalUrls[link].url}`} target="_blank">
                    <Typography variant="h6">{externalUrls[link].icon}</Typography>
                    <Typography variant="h6">{externalUrls[link].title}</Typography>
                  </Link>
                );
              })}
            </div>
            <div className="social">
              <div className="docs-btn">
                <Button>Docs</Button>
                <Button className="mt-3">Merch</Button>
              </div>
            </div>
            <Social />
          </Box>
        </Box>
      </Paper> */}
    </>
  );
}

export default NavContent;
