import { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Paper, Button, Typography, Box, Zoom, Container, useMediaQuery, Grid } from "@material-ui/core";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { Skeleton } from "@material-ui/lab";
import { useSelector } from "react-redux";
import { trim, formatCurrency } from "../../helpers";
import { useTheme } from "@material-ui/core/styles";
import "./dashboard.scss";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip.jsx";
import Cheez from "../../assets/images/cheezChristmas.png";
//bond imports
import { allBondsMap } from "src/helpers/AllBonds";
import useBonds from "../../hooks/Bonds";
import { dai } from "src/helpers/AllBonds";
import Cheesin from "../../assets/images/cheesin.png";
import Farm from "../../assets/images/farm.jpeg";
import { useWeb3Context } from "../../hooks/web3Context";
import { Row, Col, Modal } from "react-bootstrap";
import Slider from "react-slick";

function Dashboard() {
  const [data, setData] = useState(null);
  const [apy, setApy] = useState(null);
  const [runway, setRunway] = useState(null);
  const [staked, setStaked] = useState(null);
  const [numberOfMice, setNumberOfMice] = useState(1);
  const [numberOfCats, setNumberOfCats] = useState(1);
  const theme = useTheme();
  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");
  const { chainID, address } = useWeb3Context();
  const networkID = chainID;

  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });
  const circSupply = useSelector(state => {
    return state.app.circSupply;
  });
  const totalSupply = useSelector(state => {
    console.log("totalSupply: ", state.app.totalSupply);
    return state.app.totalSupply;
  });
  const marketCap = useSelector(state => {
    return state.app.marketCap;
  });

  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });

  const backingPerOhm = useSelector(state => {
    return state.app.treasuryMarketValue / state.app.circSupply;
  });

  const wsOhmPrice = useSelector(state => {
    return state.app.marketPrice * state.app.currentIndex;
  });

  const stakedCheese = useSelector(state => {
    return state.app.stakedAmount;
  });

  const riskFreeValue = useSelector(state => {
    console.log("rfv: ", state.app.treasuryMarketValue);
    return state.app.treasuryMarketValue;
  });

  const currentRunway = useSelector(state => {
    return state.app.runway;
  });

  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY;
  });

  const miceStaked = useSelector(state => {
    return state.app.miceInMaze;
  });

  const catsStaked = useSelector(state => {
    return state.app.catsInMaze;
  });

  const trapsStaked = useSelector(state => {
    return state.app.trapsInMaze;
  });

  let history = useHistory();

  const { bonds } = useBonds();

  const OHM_ADDRESS = addresses[networkID].OHM_ADDRESS;
  const daiAddress = dai.getAddressForReserve(networkID);

  const isAppLoading = useSelector(state => state.app.loading);
  const isAccountLoading = useSelector(state => state.account.loading);
  const accountBonds = useSelector(state => {
    const withInterestDue = [];
    for (const bond in state.account.bonds) {
      if (state.account.bonds[bond].interestDue > 0) {
        withInterestDue.push(state.account.bonds[bond]);
      }
    }
    return withInterestDue;
  });

  const treasuryBalance = useSelector(state => {
    if (state.bonding.loading == false) {
      let tokenBalances = 0;
      for (const bond in allBondsMap) {
        if (state.bonding[bond]) {
          if (state.bonding[bond].bond != "ohm_dai_lp" && state.bonding[bond].bond != "cheez_dai_lp") {
            tokenBalances += state.bonding[bond].purchased;
          }
        }
      }
      tokenBalances += 750000;
      return tokenBalances;
    }
  });

  const correctAPY = stakingAPY * 100;
  const trimmedStakingAPY = trim(stakingAPY * 100, 1)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const [boxactive, setBoxActive] = useState(2);

  const [getStartModal, setGetStartModal] = useState(false);
  const getStartModalClose = () => setGetStartModal(false);
  const getStartModalShow = () => setGetStartModal(true);

  const [modalNumber, setModalNumber] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 4000,
  };

  return (
    <>
      <div className="banner mt-4">
        {/* slider  */}
        <Slider {...settings}>
          <div>
            <img src={require("../../assets/images/banner.png").default} alt="" />
          </div>
          <div>
            <div style={{ position: "relative" }}>
              <img src={require("../../assets/images/dash-banner-cows.png").default} alt="" />
              <div className="banner-btn-cont">
                <Link to="/play">
                  <Button className="banner-btn btn-white" variant="outlined" color="primary">
                    Learn more
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button className="banner-btn btn-yellow" variant="outlined" color="primary">
                    Shop for Cows
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div>
            <div style={{ position: "relative" }}>
              <img src={require("../../assets/images/dash-banner-need-help.png").default} alt="" />
              <div className="banner-btn-cont">
                <a href="https://discord.gg/cheesedao" target="_blank" rel="noopener noreferrer">
                  <Button className="banner-btn btn-danger" variant="outlined" color="primary">
                    Setup Help
                  </Button>
                </a>
                <a href="https://docs.cheesedao.xyz/" target="_blank" rel="noopener noreferrer">
                  <Button className="banner-btn btn-success" variant="outlined" color="primary">
                    Game Docs
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </Slider>
      </div>
      <div className="dashboard-home dashboard-home-1">
        <Row className="m-0 mt-5 justify-content-center">
          <Col lg={4} md={6} sm={12}>
            <div className="box1 p-4 mb-1">
              <span>Market Cap</span>
              <h4>
                {marketCap && formatCurrency(marketCap, 0)}
                {!marketCap && <Skeleton type="text" width="150px" style={{ margin: "0 auto" }} />}
              </h4>
            </div>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <div
              className="active box1 p-4 mb-1"
              onClick={() => {
                window.open(`https://dexscreener.com/harmony/0x82723f6c0b32f28ddc2006b9cdbca6cee0ad957a`);
              }}
            >
              <span>Cheez Price</span>
              <h4>
                {marketPrice ? (
                  formatCurrency(marketPrice, 2)
                ) : (
                  <Skeleton type="text" width="150px" style={{ margin: "0 auto" }} />
                )}
              </h4>
            </div>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <div className="box1 p-4 mb-1">
              <span>Staked 🧀 / Circulating 🧀</span>
              <h4>
                {stakedCheese ? (
                  parseInt(stakedCheese) + " / " + parseInt(circSupply)
                ) : (
                  <Skeleton type="text" width="150px" style={{ margin: "0 auto" }} />
                )}
              </h4>
            </div>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <div className="box1 p-4 mb-1">
              <span>CheeseDAO Treasury</span>
              <h4>
                {isAppLoading ? (
                  <Skeleton width="180px" type="text" style={{ margin: "0 auto" }} />
                ) : (
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(treasuryBalance)
                )}
              </h4>
            </div>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <div className="box1 p-4 mb-1">
              <span>APY</span>
              <h4>
                {correctAPY ? (
                  correctAPY
                    .toFixed(0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "% APY"
                ) : (
                  <Skeleton type="text" />
                )}
              </h4>
            </div>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <div className="box1 p-4 mb-1">
              <span>Runway</span>
              <h4>
                {currentRunway ? (
                  `${currentRunway.toFixed(0)} days`
                ) : (
                  <Skeleton type="text" width="150px" style={{ margin: "0 auto" }} />
                )}
              </h4>
            </div>
          </Col>
        </Row>
      </div>
      <div className="dashboard-home mt-5">
        <Row className="m-0 justify-content-center">
          <Col lg={4} md={8} sm={12}>
            <div className="bigbox1 p-4 d-flex flex-column justify-content-center align-items-center mb-1">
              <img src={require("../../assets/images/mouse.png").default} alt="" width={150} />
              <div className="bigbox-text">
                <span>Mouse in Maze</span>
                <h4>
                  {miceStaked ? (
                    `${miceStaked} Mice`
                  ) : (
                    <Skeleton type="text" width="150px" style={{ margin: "0 auto" }} />
                  )}
                </h4>
              </div>
            </div>
          </Col>
          <Col lg={4} md={8} sm={12}>
            <div className="bigbox1 p-4 d-flex flex-column justify-content-center align-items-center">
              <img src={require("../../assets/images/cat.png").default} alt="" />
              <div className="bigbox-text">
                <span>Cats in Maze</span>
                <h4>
                  {catsStaked ? (
                    `${catsStaked} Cats`
                  ) : (
                    <Skeleton type="text" width="150px" style={{ margin: "0 auto" }} />
                  )}
                </h4>
              </div>
            </div>
          </Col>
          <Col lg={4} md={8} sm={12}>
            <div className="bigbox1 p-4 d-flex flex-column justify-content-center align-items-center">
              <img src={require("../../assets/images/mouse-trap.png").default} alt="" />
              <div className="bigbox-text">
                <span>Traps in Maze</span>
                <h4>
                  {trapsStaked ? (
                    `${trapsStaked} Traps`
                  ) : (
                    <Skeleton type="text" width="150px" style={{ margin: "0 auto" }} />
                  )}
                </h4>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      {!address ? (
        <div className="get-start-main mt-5">
          <Row className="align-items-center w-100">
            <Col lg={9} md={12}>
              <p>Are you new here?</p>
            </Col>
            <Col lg={3} md={12}>
              <div>
                <Button
                  className="start-btn"
                  onClick={() => {
                    getStartModalShow(), setModalNumber(1);
                  }}
                >
                  GET STARTED
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      ) : (
        <></>
      )}

      <Modal show={getStartModal} onHide={getStartModalClose}>
        {modalNumber === 1 && (
          <Modal.Body className="modal1">
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
              onClick={getStartModalClose}
            ></button>
            <img src={require("../../assets/images/mouse-modal.png").default} alt="" />
            <h3>Getting to Know You</h3>
            <div className="text-align-left">
              <p>Welcome! It’s really gouda to have you here.</p>
              <p>
                To get started with CheeseDAO, you’ll need a few basic tools. A browser (Chrome or Brave are preferred)
                with a Metamask wallet extension installed and Harmony ONE tokens in it. Do you have any of these set up
                already?
              </p>
            </div>
            <div className="browser">
              <img src={require("../../assets/images/crom.png").default} alt="" />
              <img src={require("../../assets/images/firefox.png").default} alt="" />
              <img src={require("../../assets/images/brave.png").default} alt="" />
              <img src={require("../../assets/images/crom2.png").default} alt="" />
            </div>
            <div className="input-check mt-3">
              <input type="radio" id="check1" name="browser" />
              <label for="check1">I use one of these browsers</label>
            </div>
            <div className="input-check mt-3">
              <input type="radio" id="check2" name="browser" checked />
              <label for="check2">I don’t use these browsers</label>
            </div>
            <div className="metamask text-align-left mt-3">
              <img src={require("../../assets/images/metamask.png").default} alt="" />
              <div className="input-check mt-3">
                <input type="radio" id="check3" name="browser2" checked />
                <label for="check3">I have Metamask</label>
              </div>
              <div className="input-check mt-3">
                <input type="radio" id="check4" name="browser2" />
                <label for="check4">I don’t have Metamask</label>
              </div>
            </div>
            <div className="metamask text-align-left mt-3">
              <img src={require("../../assets/images/harmony.png").default} alt="" />
              <div className="input-check mt-3">
                <input type="radio" id="check5" name="harmony" checked />
                <label for="check5">I have some Harmony ONE</label>
              </div>
              <div className="input-check mt-3">
                <input type="radio" id="check6" name="harmony" />
                <label for="check6">I don’t have any Harmony ONE</label>
              </div>
            </div>
            <div className="back-next">
              <Button className="back back-color" disabled>
                Back
              </Button>
              <Button
                className="next"
                onClick={() => {
                  setModalNumber(2);
                }}
              >
                Next
              </Button>
            </div>
          </Modal.Body>
        )}

        {modalNumber === 2 && (
          <Modal.Body className=" modal2">
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
              onClick={getStartModalClose}
            ></button>
            <div className="browser justify-content-center">
              <img src={require("../../assets/images/crom.png").default} alt="" />
              <img src={require("../../assets/images/firefox.png").default} alt="" />
              <img src={require("../../assets/images/brave.png").default} alt="" />
              <img src={require("../../assets/images/crom2.png").default} alt="" />
            </div>
            <h2 className="mt-2">Browser Setup</h2>
            <p>
              Before you can set up your wallet, you’ll need to have one of the above four browsers installed on your
              computer. We think you’re cheddar off with Google Chrome or Brave, but any of them will work.
            </p>
            <p>Once you have one of these browsers installed, click Next. </p>
            <div className="back-next">
              <Button
                className="back"
                onClick={() => {
                  setModalNumber(1);
                }}
              >
                Back
              </Button>
              <Button
                className="next"
                onClick={() => {
                  setModalNumber(3);
                }}
              >
                Next
              </Button>
            </div>
          </Modal.Body>
        )}

        {modalNumber === 3 && (
          <Modal.Body className=" modal2">
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
              onClick={getStartModalClose}
            ></button>
            <img src={require("../../assets/images/metamask-icon.png").default} alt="" />
            <h2>Metamask</h2>
            <p>
              To interact with CheeseDAO, you’ll need a browser extension called Metamask wallet. You can{" "}
              <span className="text-green">click here</span> to download the Metamask extension from the official
              website.
            </p>
            <div className="d-flex align-items-center">
              <Button>
                <img src={require("../../assets/images/left-side.png").default} alt="" />
              </Button>
              <div className="slider">
                <img src={require("../../assets/images/slide1.png").default} alt="" />
              </div>
              <Button>
                <img src={require("../../assets/images/right-side.png").default} alt="" />
              </Button>
            </div>
            <p className="mt-3">
              Click the blue ‘download’ button and, on the following page, select your browser and download Metamask.
              Follow any prompts to enable the extension and accept security permissions.
            </p>
            <p>Once you see the Metamask welcome screen, click Next on this window. </p>
            <div className="back-next">
              <Button
                className="back"
                onClick={() => {
                  setModalNumber(2);
                }}
              >
                Back
              </Button>
              <Button
                className="next"
                onClick={() => {
                  setModalNumber(4);
                }}
              >
                Next
              </Button>
            </div>
          </Modal.Body>
        )}

        {modalNumber === 4 && (
          <Modal.Body className="modal3">
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
              onClick={getStartModalClose}
            ></button>
            <img src={require("../../assets/images/metamask-icon.png").default} alt="" />
            <h2>Metamask</h2>
            <p>Excellent.</p>
            <p>
              Now that the Metamask extension is installed, we can configure it for CheeseDAO. This process takes only a
              few minutes. Your wallet information is extremely important and very sensitive. If you lose your seed
              phrase, no one can recover it for you which means that your account, along with your tokens and items,
              will be lost forever. Take the time to create a strong password and to securely store your recovery
              information.{" "}
            </p>
            <p>
              Now, go ahead and click Get Started. If you had Metamask before, you can select Import Wallet, but chances
              are you’re new to this, so you’ll want to Create a Wallet. Follow the process to get your wallet up and
              running and come back to this page and click Next when you’re done.
            </p>
            <div className="back-next">
              <Button
                className="back"
                onClick={() => {
                  setModalNumber(3);
                }}
              >
                Back
              </Button>
              <Button
                className="next"
                onClick={() => {
                  setModalNumber(5);
                }}
              >
                Next
              </Button>
            </div>
          </Modal.Body>
        )}

        {modalNumber === 5 && (
          <Modal.Body className="modal3">
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
              onClick={getStartModalClose}
            ></button>
            <img src={require("../../assets/images/metamask-icon.png").default} alt="" />
            <h2>Metamask</h2>
            <p>You’re doing grate! Make sure to keep a hard copy of your seed phrase in a safe location.</p>
            <p>
              Next, we’ll change a few settings. This is easy, because I’m going to give you the settings to copy and
              paste, direct from CheeseDAO’s documentation page. You’ll start this process by opening the extension and
              clicking at the top where it says Ethereum Mainnet. In the dropdown menu, choose Custom RPC and then
              copy/paste the following information:
            </p>
            <p className="mb-0">Network Name: Harmony Mainnet</p>
            <p className="mb-0">
              New RPC URL:<span className="text-blue"> https://api.harmony.one</span>
            </p>
            <p className="mb-0">Chain ID: 1666600000</p>
            <p className="mb-0">Currency symbol: ONE</p>
            <p className="mb-0">
              {" "}
              Block Explorer URL: <span className="text-blue">https://explorer.harmony.one/</span>
            </p>
            <div className="back-next">
              <Button
                className="back"
                onClick={() => {
                  setModalNumber(4);
                }}
              >
                Back
              </Button>
              <Button
                className="next"
                onClick={() => {
                  setModalNumber(6);
                }}
              >
                Next
              </Button>
            </div>
          </Modal.Body>
        )}

        {modalNumber === 6 && (
          <Modal.Body className="modal3">
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
              onClick={getStartModalClose}
            ></button>
            <img src={require("../../assets/images/harmony-icon.png").default} alt="" />
            <h2>Harmony ONE Tokens</h2>
            <p>
              Before I release you into the Cheesyverse, you’ll need to own some Harmony ONE tokens. CheeseDAO is hosted
              on the Harmony blockchain, so you’ll need these tokens both for gas fees (the transaction fees charged
              when trading tokens) and to convert into CHEEZ.{" "}
            </p>
            <p>
              Gas fees on the Harmony network are very inexpensive, so even a single ONE token is enough gas for quite a
              while; however, you’ll want plenty of ONE to purchase CHEEZ and other tokens ingame. You can purchase ONE
              on a variety of exchanges. We cannot advise you on the pros and cons of each exchange, but some options to
              consider are Crypto.com, Binance or a direct purchase from Harmony’s vendor partner on their website.
            </p>
            <p className="text-yelow">
              Note that if your vendor asks for a wallet address to deposit the tokens, you can get this address from
              Metamask. By default it’s just called Account 1 and you can copy the wallet address by clicking on it. If
              the vendor requires a ONE address, you can find yours by clicking the menu next to your wallet address and
              choosing “View in Explorer.”
            </p>
            <p>Once you have acquired some ONE tokens, come back to this page and click Next.</p>
            <div className="back-next">
              <Button
                className="back"
                onClick={() => {
                  setModalNumber(5);
                }}
              >
                Back
              </Button>
              <Button
                className="next"
                onClick={() => {
                  setModalNumber(7);
                }}
              >
                Next
              </Button>
            </div>
          </Modal.Body>
        )}

        {modalNumber === 7 && (
          <Modal.Body className="modal3">
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
              onClick={getStartModalClose}
            ></button>
            <img src={require("../../assets/images/harmony-icon.png").default} alt="" />
            <h2>Harmony ONE Tokens</h2>
            <p>Queso, what’s next?</p>
            <p>
              We need to transfer ONE tokens that you own into your Metamask wallet so that you can use them inside the
              game. You can click on Metamask to see your token balance and skip this step if the tokens are already in
              your wallet. Otherwise, you’ll need to use the options built in with your vendor to transfer the ONE
              tokens to your private Metamask wallet.{" "}
            </p>
            <p>
              Generally, you’ll select an option like “send” or “transfer,” choose your token and the amount to move,
              and then enter the target wallet address. If you haven’t done this before, you can always transfer a small
              amount first to make sure it works, before moving your full balance.
            </p>
            <p>Take it nice and cheesy, then come back to this page and click Next when you’re done.</p>
            <div className="back-next">
              <Button
                className="back"
                onClick={() => {
                  setModalNumber(6);
                }}
              >
                Back
              </Button>
              <Button
                className="next"
                onClick={() => {
                  setModalNumber(8);
                }}
              >
                Next
              </Button>
            </div>
          </Modal.Body>
        )}

        {modalNumber === 8 && (
          <Modal.Body className="modal3">
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
              onClick={getStartModalClose}
            ></button>
            <img src={require("../../assets/images/mouse-modal.png").default} alt="" />
            <p className="mt-3">
              Gouda, very gouda. Now that we’ve set up the necessary tools, you may enter into the Cheesyverse.
            </p>
            <p>
              At the bottom of this window, you’ll find the “BUY CHEEZ” button which will take you to SushiSwap, where
              you can swap your ONE tokens for CHEEZ tokens (always keep some ONE left over for gas!).
            </p>
            <p>
              Once you have CHEEZ tokens, you can stake them on the Ageing tab, or you can visit the marketplace and
              trade game pieces. Game pieces can be staked on the Play tab to generate rewards – but brie-ware of the
              risks!{" "}
            </p>
            <p>You’re on your own now, friend. I swiss you all the best.</p>
            <div className="back-next">
              <Button
                className="back"
                onClick={() => {
                  setModalNumber(7);
                }}
              >
                Back
              </Button>
              <Button
                className="next"
                disabled
                onClick={() => {
                  setModalNumber(0);
                  getStartModalClose();
                }}
              >
                Next
              </Button>
            </div>
          </Modal.Body>
        )}
      </Modal>
    </>
  );
}

export default Dashboard;
