import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Paper, Button, Typography, Box, Zoom, Container, useMediaQuery, Grid } from "@material-ui/core";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { Skeleton } from "@material-ui/lab";
import { useSelector } from "react-redux";
import { trim, formatCurrency } from "../../helpers";
import { useTheme } from "@material-ui/core/styles";
import "./dashboard.scss";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip.jsx";
import Cheez from "./cheezChristmas.png";
//bond imports
import { allBondsMap } from "src/helpers/AllBonds";
import useBonds from "../../hooks/Bonds";
import { dai } from "src/helpers/AllBonds";
import Cheesin from "./cheesin.png";
import Farm from "./farm.jpeg";
import { useWeb3Context } from "../../hooks/web3Context";
import { Row, Col } from 'react-bootstrap'

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
  const { chainID } = useWeb3Context();
  const networkID = chainID;

  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });
  const circSupply = useSelector(state => {
    return state.app.circSupply;
  });
  const totalSupply = useSelector(state => {
    console.log("totalSupply: ", state.app.totalSupply)
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
    console.log("rfv: ", state.app.treasuryMarketValue)
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
      tokenBalances += 750000
      return tokenBalances;
    }
  });

  const correctAPY = (stakingAPY * 100)
  const trimmedStakingAPY = trim(stakingAPY * 100, 1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const [boxactive,setBoxActive] = useState();

  return (
    <>
      <div className="dashboard-home">
        <Row className="m-0 justify-content-center">
          <Col lg={4} md={6} sm={12}>
            <div className={`${boxactive === 1 ? "active" : ""} box1 p-4`} onClick={() => setBoxActive(1)}>
              <span>Market Cap</span>
              <h4>$1,665,812</h4>
            </div>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <div className={`${boxactive === 2 ? "active" : ""} box1 p-4`} onClick={() => setBoxActive(2)}>
              <span>Cheez Price</span>
              <h4>$22.58</h4>
            </div>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <div className={`${boxactive === 3 ? "active" : ""} box1 p-4`} onClick={() => setBoxActive(3)}>
              <span>Staked 🧀 / Circulating 🧀</span>
              <h4>64259 / 67216</h4>
            </div>
          </Col>
        </Row>
      </div>

      <div className="dashboard-home mt-5">
        <Row className="m-0 justify-content-center">
          <Col lg={4} md={6} sm={12}>
            <div className={`${boxactive === 4 ? "active" : ""} box1 p-4`} onClick={() => setBoxActive(4)}>
              <span>CheeseDAO Treasury</span>
              <h4>$3,126,041</h4>
            </div>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <div className={`${boxactive === 5 ? "active" : ""} box1 p-4`} onClick={() => setBoxActive(5)}>
              <span>APY</span>
              <h4>74,675% APY</h4>
            </div>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <div className={`${boxactive === 6 ? "active" : ""} box1 p-4`} onClick={() => setBoxActive(6)}>
              <span>Runway</span>
              <h4>172 days</h4>
            </div>
          </Col>
        </Row>
      </div>
      <div className="dashboard-home mt-5">
        <Row className="m-0 justify-content-center">
          <Col lg={4} md={6} sm={12}>
            <div className={`${boxactive === 4 ? "active" : ""} bigbox1 p-4`} onClick={() => setBoxActive(4)}>
              <img src={require('./mouse.png').default} alt="" width={150} />
              <div className="bigbox-text">
                <span>Mouse in Maze</span>
                <h4>3148 Mouse</h4>
              </div>
            </div>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <div className={`${boxactive === 5 ? "active" : ""} bigbox1 p-4`} onClick={() => setBoxActive(5)}>
              <img src={require('./cat.png').default} alt="" />
              <div className="bigbox-text">
                <span>Cats in Maze</span>
                <h4>3148 Mouse</h4>
              </div>
            </div>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <div className={`${boxactive === 6 ? "active" : ""} bigbox1 p-4`} onClick={() => setBoxActive(6)}>
              <img src={require('./mouse-trap.png').default} alt="" />
              <div className="bigbox-text">
                <span>Traps in Maze</span>
                <h4>481 Traps</h4>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className="get-start-main mt-5">
        <Row className="align-items-center w-100">
          <Col lg={9} md={12}>
            <p>Donec lobortis auctor posuere amet egestas vulputate lacus consequat.</p>
          </Col>
          <Col lg={3} md={12}>
            <div>
              <Button className="start-btn">GET STARTED</Button>
            </div>
          </Col>
        </Row>
      </div>
    </>
    // <div id="treasury-dashboard-view" className={`${smallerScreen && "smaller"} ${verySmallScreen && "very-small"}`}>
    //   <Container
    //     style={{
    //       paddingLeft: smallerScreen || verySmallScreen ? "0" : "3.3rem",
    //       paddingRight: smallerScreen || verySmallScreen ? "0" : "3.3rem",
    //     }}
    //   >
    //     <Box className={`hero-metrics`}>
    //       <Paper className="cheez-card" style={{marginBottom: "3%"}}>
    //         <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
    //           <Box className="metric market">
    //             <Typography variant="h6" color="textSecondary">
    //               Market Cap
    //             </Typography>
    //             <Typography variant="h5">
    //               {marketCap && formatCurrency(marketCap, 0)}
    //               {!marketCap && <Skeleton type="text" width="150px" style={{margin: "0 auto"}} />}
    //             </Typography>
    //           </Box>

    //           <Box className="metric price hover" onClick={() => {window.open(`https://dexscreener.com/harmony/0x82723f6c0b32f28ddc2006b9cdbca6cee0ad957a`)}} style={{border: "1px solid #ebc50c", borderRadius: "10px", paddingTop: "1%", paddingBottom: "1%"}}>
    //             <Typography variant="h6" color="textSecondary">
    //               CHEEZ Price
    //             </Typography>
    //             <Typography variant="h5">
    //               {/* appleseed-fix */}
    //               {marketPrice ? formatCurrency(marketPrice, 2) : <Skeleton type="text" width="150px" style={{margin: "0 auto"}} />}
    //             </Typography>
    //           </Box>

    //           <Box className="metric circ">
    //             <Typography variant="h6" color="textSecondary">
    //               Staked 🧀 / Circulating 🧀
    //             </Typography>
    //             <Typography variant="h5">
    //               {stakedCheese ? (
    //                  parseInt(stakedCheese) + " / " + parseInt(circSupply)
    //               ) : (
    //                 <Skeleton type="text" width="150px" style={{margin: "0 auto"}} />
    //               )}
    //             </Typography>
    //           </Box>

    //           <Box className="metric price">
    //           <Typography variant="h6" color="textSecondary">
    //               CheeseDAO Treasury
    //             </Typography>
    //             <Typography variant="h5">
    //               {isAppLoading ? (
    //                 <Skeleton width="180px" type="text" style={{margin: "0 auto"}} />
    //               ) : (
    //                 new Intl.NumberFormat("en-US", {
    //                   style: "currency",
    //                   currency: "USD",
    //                   maximumFractionDigits: 0,
    //                   minimumFractionDigits: 0,
    //                 }).format(treasuryBalance)
    //               )}
    //             </Typography>
    //           </Box>

    //           <Box className="metric price">
    //           <Typography variant="h4">
    //                     {stakingAPY ? (
    //                       <><Typography variant="h5" color="textSecondary">
    //                       APY 
    //                       {/* <InfoTooltip
    //                         message=
    //                           {`${correctAPY.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}%`}
    //                       /> */}
    //                     </Typography>
    //                     <Typography variant="h5">
    //                       {correctAPY ? correctAPY.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "% APY" : <Skeleton type="text" />}
    //                     </Typography>

    //                     </>
    //                     ) : (
    //                       <Skeleton width="150px" style={{margin: "0 auto"}} />
    //                     )}
    //                   </Typography>
    //           </Box>

    //           <Box className="metric circ">
    //             <Typography variant="h6" color="textSecondary">
    //               Runway
    //             </Typography>
    //             <Typography variant="h5">
    //               {currentRunway ? (
    //                  `${currentRunway.toFixed(0)} days`
    //               ) : (
    //                 <Skeleton type="text" width="150px" style={{margin: "0 auto"}} />
    //               )}
    //             </Typography>
    //           </Box>
    //           <Box className="metric circ">
    //             <Typography variant="h6" color="textSecondary">
    //               Mice in Maze
    //             </Typography>
    //             <Typography variant="h5">
    //               {miceStaked ? (
    //                  `${miceStaked} Mice`
    //               ) : (
    //                 <Skeleton type="text" width="150px" style={{margin: "0 auto"}} />
    //               )}
    //             </Typography>
    //           </Box>
    //           <Box className="metric circ">
    //             <Typography variant="h6" color="textSecondary">
    //               Cats in Maze
    //             </Typography>
    //             <Typography variant="h5">
    //               {catsStaked ? (
    //                  `${catsStaked} Cats`
    //               ) : (
    //                 <Skeleton type="text" width="150px" style={{margin: "0 auto"}} />
    //               )}
    //             </Typography>
    //           </Box>
    //           <Box className="metric circ">
    //             <Typography variant="h6" color="textSecondary">
    //               Traps in Maze
    //             </Typography>
    //             <Typography variant="h5">
    //               {trapsStaked ? (
    //                  `${trapsStaked} Traps`
    //               ) : (
    //                 <Skeleton type="text" width="150px" style={{margin: "0 auto"}} />
    //               )}
    //             </Typography>
    //           </Box>
    //         </Box>
    //       </Paper>
    //     </Box>
    //     <Box>
    //     <Paper className="hover2" style={{marginTop: "4%", marginBottom: "3%", background: "transparent", height: "75px", border: "1px solid #FF0000"}} onClick={() => history.push('/nftstaking')}>
    //         <Typography variant="h4" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: ".75%", color: "#3ce8a6"}}>Unstake from OG staking pools!</Typography>
    //       </Paper>

    //         <Paper style={{marginTop: "5%", marginBottom: "3%", background: "transparent", height: "100px", border: "1px solid #3ce8a6", display: "flex", flexFlow: "row-nowrap", justifyContent: "center"}}>
    //           <Typography variant="h2" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginBottom: "2%", color: "#3ce8a6"}}>On-Chain Governance Coming Soon!</Typography>
    //           <img src={Cheesin} alt="chessin mascot logo" style={{height: "50px", width: "50px", marginTop: "2%", marginLeft: "2%"}} />
    //         </Paper>
    //       </Box>
    //       <Box>
    //       <Paper className="hover2" style={{marginTop: "4%", marginBottom: "3%", background: "transparent", height: "75px", border: "1px solid #ebc50c"}} onClick={() => history.push('/nfts')}>
    //         <Typography variant="h4" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginBottom: "2%", color: "#FFFFFF"}}>Take me to my NFTs!</Typography>
    //       </Paper>
    //     </Box>
    //   </Container>
    // </div>
  );
}

export default Dashboard;