import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Box,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
} from "@material-ui/core";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip.jsx";
import NewReleases from "@material-ui/icons/NewReleases";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import { trim } from "../../helpers";
import { changeApproval, changeStake, forfeit } from "../../slices/StakeThunk";
import "./stake.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";
import "./treasury.css";
import { addQuarters } from "date-fns/esm";
import { Button, Col, Row } from "react-bootstrap";


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Ageing() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");

  const isAppLoading = useSelector(state => state.app.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });
  const fiveDayRate = useSelector(state => {
    return state.app.fiveDayRate;
  });
  const ohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const oldSohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.oldsohm;
  });
  const sohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const fsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.fsohm;
  });
  const wsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.wsohm;
  });
  const deposit = useSelector(state => {
    return state.account.balances && state.account.balances.deposit;
  });
  const stakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.ohmStake;
  });
  const unstakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.ohmUnstake;
  });
  const stakingRebase = useSelector(state => {
    return state.app.stakingRebase;
  });
  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY;
  });
  const stakingTVL = useSelector(state => {
    return state.app.stakingTVL;
  });
  const epochsLeft = useSelector(state => {
    return state.account.staking && state.account.staking.epochsLeft;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    if (view === 0) {
      setQuantity(ohmBalance);
    } else {
      setQuantity(sohmBalance);
    }
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onForfeit = async action=> {
    await dispatch(changeStake({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };

  const onChangeStake = async action => {
    console.log(quantity)
    // eslint-disable-next-line no-restricted-globals
    if(action === "claim"){
      await dispatch(changeStake({ address, action, value: quantity.toString(), provider, networkID: chainID }));
      return
    }
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity, "gwei");
    if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(ohmBalance, "gwei"))) {
      return dispatch(error("You cannot stake more than your CHEEZ balance."));
    }

    if (action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(sohmBalance, "gwei"))) {
      return dispatch(error("You cannot unstake more than your sCHEEZ balance."));
    }

    await dispatch(changeStake({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "ohm") return stakeAllowance > 0;
      if (token === "sohm") return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance],
  );

  const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);

  let modalButton = [];

  modalButton.push(
    <Button variant="outlined" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const changeView = (event, newView) => {
    setView(newView);
  };

  const trimmedBalance = Number(
    [sohmBalance, fsohmBalance, wsohmBalance]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );

  const trimmedDeposit = Number(
    [deposit]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );

  const trimmedStakingAPY = trim(stakingAPY * 100, 1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const correctAPY = (stakingAPY * 100)
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((stakingRebasePercentage / 100) * (trimmedBalance + trimmedDeposit), 4);

  let history = useHistory();

  return (

    <>
      <div className="ageing-main">
        <Button className="btn-full">5 hrs, 34 mins to next rebase</Button>
        <Row className="mt-5 justify-content-center">
          <Col lg={4} md={6} sm={12}>
              <div className="bg-wight">  
                <p className="mb-0">APY</p>
                <h3>74,675% APY</h3>
              </div>
          </Col>
          <Col lg={4} md={6} sm={12}>
              <div className="bg-wight">  
                <p className="mb-0">Total Value Deposited</p>
                <h3>$1,455,877</h3>
              </div>
          </Col>
          <Col lg={4} md={6} sm={12}>
              <div className="bg-wight">  
                <p className="mb-0">Current Index</p>
                <h3>4,2 CHEEZ</h3>
              </div>
          </Col>
        </Row>
        <div className="wall-btn d-flex justify-content-center mt-5">
          <div className="wall-con">
            <span>Connect your wallet to stake CHEEZ</span>
            <Button className="wallet-btn">Connect wallet</Button>
          </div>
        </div>
      </div>
    </>
    // <div id="stake-view">
    //   <Zoom in={true} onEntered={() => setZoomed(true)}>
    //     <Paper className={`cheez-card`}>
    //       <Grid container direction="column" spacing={2}>
    //         <Grid item>
    //           <div className="card-header" style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
    //             <Typography variant="h5">Ageing (🧀,🧀)</Typography>
    //             <div style={{paddingTop: "1%"}}>
    //               <RebaseTimer />
    //             </div>
    //             {address && oldSohmBalance > 0.01 && (
    //               <Link
    //                 className="migrate-scheez-button"
    //                 style={{ textDecoration: "none" }}
    //                 href="https://docs.cheesedao.xyz"
    //                 aria-label="migrate-sohm"
    //                 target="_blank"
    //               >
    //                 <NewReleases viewBox="0 0 24 24" />
    //                 <Typography>Migrate sCHEEZ!</Typography>
    //               </Link>
    //             )}
    //           </div>
    //         </Grid>

    //         <Grid item>
    //           <div className="stake-top-metrics">
    //             <Grid container spacing={2} alignItems="flex-end">
    //               <Grid item xs={12} sm={4} md={4} lg={4}>
    //               <div className="stake-apy">
    //                   <Typography variant="h4">
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
    //                       <Skeleton width="150px" />
    //                     )}
    //                   </Typography>
    //                 </div>
    //               </Grid>

    //               <Grid item xs={12} sm={4} md={4} lg={4}>
    //                 <div className="stake-tvl">
    //                   <Typography variant="h5" color="textSecondary">
    //                     Total Value Deposited
    //                   </Typography>
    //                   <Typography variant="h4">
    //                     {stakingTVL ? (
    //                       new Intl.NumberFormat("en-US", {
    //                         style: "currency",
    //                         currency: "USD",
    //                         maximumFractionDigits: 0,
    //                         minimumFractionDigits: 0,
    //                       }).format(stakingTVL)
    //                     ) : (
    //                       <Skeleton width="150px" />
    //                     )}
    //                   </Typography>
    //                 </div>
    //               </Grid>

    //               <Grid item xs={12} sm={4} md={4} lg={4}>
    //                 <div className="stake-index">
    //                   <Typography variant="h5" color="textSecondary">
    //                     Current Index
    //                   </Typography>
    //                   <Typography variant="h4">
    //                     {currentIndex ? <>{trim(currentIndex, 1)} CHEEZ</> : <Skeleton width="150px" />}
    //                   </Typography>
    //                 </div>
    //               </Grid>
    //             </Grid>
    //           </div>
    //         </Grid>

    //         <div className="staking-area">
    //           {!address ? (
    //             <div className="stake-wallet-notification">
    //               <div className="wallet-menu" id="wallet-menu">
    //                 {modalButton}
    //               </div>
    //               <Typography variant="h6">Connect your wallet to stake CHEEZ</Typography>
    //             </div>
    //           ) : (
    //             <>
    //               <Box className="stake-action-area">
    //                 <Tabs
    //                   key={String(zoomed)}
    //                   centered
    //                   value={view}
    //                   textColor="primary"
    //                   indicatorColor="primary"
    //                   className="stake-tab-buttons"
    //                   onChange={changeView}
    //                   aria-label="stake tabs"
    //                 >
    //                   <Tab label="Stake" {...a11yProps(0)} />
    //                   <Tab label="Unstake" {...a11yProps(1)} />
    //                 </Tabs>

    //                 <Box className="stake-action-row " display="flex" style={{flexDirection: "column"}}>
    //                   {address && !isAllowanceDataLoading ? (
    //                     (!hasAllowance("ohm") && view === 0) || (!hasAllowance("sohm") && view === 1) ? (
    //                       <Box className="help-text">
    //                         <Typography variant="body1" className="stake-note" color="textSecondary">
    //                           {view === 0 ? (
    //                             <>
    //                               First time staking <b>CHEEZ</b>?
    //                               <br />
    //                               Please approve CheeseDAO to use your <b>CHEEZ</b> for staking.
    //                             </>
    //                           ) : (
    //                             <>
    //                               First time unstaking <b>sCHEEZ</b>?
    //                               <br />
    //                               Please approve CheeseDAO to use your <b>sCHEEZ</b> for unstaking.
    //                             </>
    //                           )}
    //                         </Typography>
    //                       </Box>
    //                     ) : (
    //                       <FormControl className="cheez-input" variant="outlined" color="primary" style={{width: "70%"}}>
    //                         <InputLabel htmlFor="amount-input"></InputLabel>
    //                         <OutlinedInput
    //                           id="amount-input"
    //                           type="number"
    //                           placeholder="Enter an amount"
    //                           className="stake-input"
    //                           value={quantity}
    //                           onChange={e => setQuantity(e.target.value)}
    //                           labelWidth={0}
    //                           endAdornment={
    //                             <InputAdornment position="end">
    //                               <Button variant="text" onClick={setMax} color="inherit">
    //                                 Max
    //                               </Button>
    //                             </InputAdornment>
    //                           }
    //                         />
    //                       </FormControl>
    //                     )
    //                   ) : (
    //                     <Skeleton width="150px" />
    //                   )}
    //                   <TabPanel value={view} index={0} className="stake-tab-panel">
    //                     <Box style={{display: "flex", flexFlow: "row-nowrap", width: "100%", overflow: "visible", minWidth: "75%", justifyContent: "center"}} >
    //                     {isAllowanceDataLoading ? (
    //                       <Skeleton width="75px" style={{margin: "0 auto"}} />
    //                     ) : address && hasAllowance("ohm") ? (
    //                       <Button
    //                         className="stake-button"
    //                         variant="outlined"
    //                         color="primary"
    //                         disabled={isPendingTxn(pendingTransactions, "staking")}
    //                         onClick={() => {
    //                           onChangeStake("stake");
    //                         }}
    //                         style={{marginRight: "2%"}}
    //                       >
    //                         {txnButtonText(pendingTransactions, "staking", "Stake CHEEZ")}
    //                       </Button>
    //                     ) : (
    //                       <Button
    //                         className="stake-button"
    //                         variant="outlined"
    //                         color="primary"
    //                         style={{ marginRight: "1%"}}
    //                         disabled={isPendingTxn(pendingTransactions, "approve_staking")}
    //                         onClick={() => {
    //                           onSeekApproval("ohm");
    //                         }}
    //                       >
    //                         {txnButtonText(pendingTransactions, "approve_staking", "Approve")}
    //                       </Button>
    //                     )}
    //                     {isAllowanceDataLoading ? (
    //                       <Skeleton width="75px" style={{margin: "0 auto"}} />
    //                     ) : (
    //                       <Button
    //                       className="stake-button"
    //                       variant="outlined"
    //                       color="primary"
    //                       disabled={isPendingTxn(pendingTransactions, "claim")}
    //                       onClick={() => {
    //                         onChangeStake("claim");
    //                       }}
    //                       style={{marginLeft: "2%"}}
    //                     >
    //                       {txnButtonText(pendingTransactions, "claiming", "Claim Warmup")}
    //                     </Button>
    //                     )}
    //                     </Box>
    //                   </TabPanel>
                      
    //                   <TabPanel value={view} index={1} className="stake-tab-panel">
    //                     {isAllowanceDataLoading ? (
    //                       <Skeleton />
    //                     ) : address && hasAllowance("sohm") ? (
    //                       <Box style={{display: "flex", flexFlow: "row no-wrap", justifyContent: "center"}}>
    //                       <Button
    //                         className="stake-button"
    //                         variant="outlined"
    //                         color="primary"
    //                         style={{marginRight: "2%"}}
    //                         disabled={isPendingTxn(pendingTransactions, "unstaking")}
    //                         onClick={() => {
    //                           onChangeStake("unstake");
    //                         }}
    //                       >
    //                         {txnButtonText(pendingTransactions, "unstaking", "Unstake CHEEZ")}
    //                       </Button>
    //                       {isAllowanceDataLoading ? (
    //                       <Skeleton width="75px" style={{margin: "0 auto"}} />
    //                     ) : (
    //                       <Button
    //                       className="stake-button"
    //                       variant="outlined"
    //                       color="primary"
    //                       disabled={isPendingTxn(pendingTransactions, "forfeit")}
    //                       style={{marginLeft: "2%"}}
    //                       onClick={() => {
    //                         onForfeit("forfeit");
    //                       }}
    //                     >
    //                       {txnButtonText(pendingTransactions, "forfeiting", "Forfeit CHEEZ")}
    //                     </Button>
    //                     )}
    //                       </Box>
    //                     ) : (
    //                       <Button
    //                         className="stake-button"
    //                         variant="outlined"
    //                         color="primary"
    //                         disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
    //                         style={{marginBottom: "2%", marginRight: "2%"}}
    //                         onClick={() => {
    //                           onSeekApproval("sohm");
    //                         }}
    //                       >
    //                         {txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}
    //                       </Button>
    //                     )}
    //                   </TabPanel>
    //                 </Box>
    //               </Box>

    //               <div className={`stake-user-data`}>
    //                 <div className="data-row">
    //                   <Typography variant="body1">Your Balance</Typography>
    //                   <Typography variant="body1">
    //                     {isAppLoading ? <Skeleton width="80px" /> : <>{trim(ohmBalance, 4)} CHEEZ</>}
    //                   </Typography>
    //                 </div>

    //                 <div className="data-row">
    //                   <Typography variant="body1">Your Staked Balance</Typography>
    //                   <Typography variant="body1">
    //                     {isAppLoading ? <Skeleton width="80px" /> : <>{trimmedBalance} sCHEEZ</>}
    //                   </Typography>
    //                 </div>

    //                 <div className="data-row">
    //                   <Typography variant="body1">Your Warmup Balance</Typography>
    //                   <Typography variant="body1">
    //                     {isAppLoading ? <Skeleton width="80px" /> : <>{trimmedDeposit} sCHEEZ</>}
    //                   </Typography>
    //                 </div>

    //                 <div className="data-row">
    //                   <Typography variant="body1">Epochs Left in Warmup</Typography>
    //                   <Typography variant="body1">
    //                     {isAppLoading ? <Skeleton width="80px" /> :
    //                       epochsLeft > 1 ?
    //                      <>{epochsLeft} Epochs</> :
    //                       epochsLeft == 1 ?
    //                      <>{epochsLeft} Epoch</> : 
    //                      <>Available</> 
    //                   }
    //                   </Typography>
    //                 </div>

    //                 <div className="data-row">
    //                   <Typography variant="body1">Next Reward Amount</Typography>
    //                   <Typography variant="body1">
    //                     {isAppLoading ? <Skeleton width="80px" /> : <>{nextRewardValue} sCHEEZ</>}
    //                   </Typography>
    //                 </div>

    //                 <div className="data-row">
    //                   <Typography variant="body1">Next Reward Yield</Typography>
    //                   <Typography variant="body1">
    //                     {isAppLoading ? <Skeleton width="80px" /> : <>{stakingRebasePercentage}%</>}
    //                   </Typography>
    //                 </div>

    //                 <div className="data-row">
    //                   <Typography variant="body1">ROI (5-Day Rate)</Typography>
    //                   <Typography variant="body1">
    //                     {isAppLoading ? <Skeleton width="80px" /> : <>{trim(fiveDayRate * 100, 4)}%</>}
    //                   </Typography>
    //                 </div>
    //               </div>
    //             </>
    //           )}
    //         </div>
    //       </Grid>
    //     </Paper>
    //   </Zoom>
    // </div>
  );
}

export default Ageing;
