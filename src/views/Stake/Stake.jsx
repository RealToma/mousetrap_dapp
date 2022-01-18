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

  const onForfeit = async action => {
    await dispatch(changeStake({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };

  const onChangeStake = async action => {
    console.log(quantity)
    // eslint-disable-next-line no-restricted-globals
    if (action === "claim") {
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
    // <Button variant="outlined" color="primary" className="connect-button" onClick={connect} key={1}>
    //   Connect Wallet
    // </Button>,
    <Button className="wallet-btn" onClick={connect} key={1}>
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

  const [tabActive, setTabActive] = useState(1);

  return (

    <>
      <div className="ageing-main">
        <div className="btn-full"><RebaseTimer /></div>
        <Row className="mt-5 justify-content-center">
          <Col lg={4} md={6} sm={12} className="mt-3">
            <div className="bg-wight">
              <p className="mb-0">APY</p>
              <h3>{correctAPY ? correctAPY.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "% APY" : <Skeleton type="text" />}</h3>
            </div>
          </Col>
          <Col lg={4} md={6} sm={12} className="mt-3">
            <div className="bg-wight">
              <p className="mb-0">Total Value Deposited</p>
              <h3>{stakingTVL ? (
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                }).format(stakingTVL)
              ) : (
                <Skeleton width="150px" />
              )}</h3>
            </div>
          </Col>
          <Col lg={4} md={6} sm={12} className="mt-3">
            <div className="bg-wight">
              <p className="mb-0">Current Index</p>
              <h3>{currentIndex ? <>{trim(currentIndex, 1)} CHEEZ</> : <Skeleton width="150px" />}</h3>
            </div>
          </Col>
        </Row>

        {!address ? (
          <div className="wall-btn d-flex justify-content-center mt-5">
            <div className="wall-con">
              <span className="text-black">Connect your wallet to stake CHEEZ</span>
              {modalButton}
            </div>
          </div>
        ) : (
          <>
            <div className="modal-bg-stake">
              <div className="wall-con">
                <div className="staking-area">
                  <Box className="stake-action-area border-bot">
                    <Tabs
                      key={String(zoomed)}
                      centered
                      value={view}
                      textColor="primary"
                      indicatorColor="primary"
                      className="stake-tab-buttons"
                      onChange={changeView}
                      aria-label="stake tabs"
                    >
                      <Tab className={`${tabActive === 1 ? "active" : ""} green`} label="Stake" {...a11yProps(0)}  onClick={() => setTabActive(1)}/>
                      <Tab className={`${tabActive === 2 ? "active" : ""} pink`} label="Unstake" {...a11yProps(1)} onClick={() => setTabActive(2)}/>
                    </Tabs>
                  </Box>
                  <div className="search-bar mt-3 px-3">
                    <span>Max Available: 0</span>
                    <div className="d-flex align-items-center gap max-search">
                      <div className="search-box d-flex align-items-center justify-content-between w-100">
                        <input type="text" className="w-100" />
                        <span>MAX</span>
                      </div>
                      {tabActive === 1 ? 
                      <Button className={`${tabActive === 1 ? "active" : ""} green`}>Stake CHEEZ</Button> :
                      <Button className={`${tabActive === 2 ? "active" : ""} pink`}>Unstake CHEEZ</Button>
                      }
                      
                     
                    </div>
                  </div>

                  <div className={`stake-user-data px-3`}>
                    <div className="data-row">
                      <>
                        <div className="data-sub mt-3">
                          <span>Your Balance</span>
                          <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _  _</span>
                          <span>{isAppLoading ? <Skeleton width="80px" /> : <>{trim(ohmBalance, 4)} CHEEZ</>}</span>
                        </div>
                      </>
                    </div>

                    <div className="data-row">
                      <>
                        <div className="data-sub mt-3">
                          <span>Your Staked Balance</span>
                          <span>_ _ _ _ _ _ _ _ _ _ _ _ __  _</span>
                          <span>{isAppLoading ? <Skeleton width="80px" /> : <>{trimmedBalance} sCHEEZ</>}</span>
                        </div>
                      </>
                    </div>

                    <div className="data-row">
                      <>
                        <div className="data-sub mt-3">
                          <span>Your Warmup Balance</span>
                          <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _</span>
                          <span>{isAppLoading ? <Skeleton width="80px" /> : <>{trimmedDeposit} sCHEEZ</>}</span>
                        </div>
                      </>
                    </div>

                    <div className="data-row">
                      <>
                        <div className="data-sub mt-3">
                          <span>Epochs Left in Warmup</span>
                          <span>_ _ _ _ _ _ _ _ _ _ _ _ _</span>
                          <span> {isAppLoading ? <Skeleton width="80px" /> :
                            epochsLeft > 1 ?
                              <>{epochsLeft} Epochs</> :
                              epochsLeft == 1 ?
                                <>{epochsLeft} Epoch</> :
                                <>Available</>
                          }</span>
                        </div>
                      </>
                    </div>

                    <div className="data-row">
                      <>
                        <div className="data-sub mt-3">
                          <span>Next Reward Amount</span>
                          <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _  _</span>
                          <span>{isAppLoading ? <Skeleton width="80px" /> : <>{nextRewardValue} sCHEEZ</>}</span>
                        </div>
                      </>
                    </div>

                    <div className="data-row">
                      <>
                        <div className="data-sub mt-3">
                          <span>Next Reward Yield</span>
                          <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</span>
                          <span>{isAppLoading ? <Skeleton width="80px" /> : <>{stakingRebasePercentage}%</>}</span>
                        </div>
                      </>
                    </div>

                    <div className="data-row">
                      <>
                        <div className="data-sub mt-3">
                          <span>ROI (5-Day Rate)</span>
                          <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</span>
                          <span>  {isAppLoading ? <Skeleton width="80px" /> : <>{trim(fiveDayRate * 100, 4)}%</>}</span>
                        </div>
                      </>
                    </div>
                    
                    <Box style={{width: "fit-content", marginTop: '15px', marginBottom: "15px"}} >
                      {isAllowanceDataLoading ? (
                        <Skeleton width="75px" style={{ margin: "0 auto" }} />
                      ) : (
                        <Button
                          className="stake-button modal-footer"
                          variant="outlined"
                          color="primary"
                          disabled={isPendingTxn(pendingTransactions, "claim")}
                          onClick={() => {
                            onChangeStake("claim");
                          }}
                          style={{ marginLeft: "2%" }}
                        >
                          {txnButtonText(pendingTransactions, "claiming", "Claim Warmup")}
                        </Button>
                      )}
                    </Box>

                    {/* <Box className="stake-action-row " display="flex" style={{ flexDirection: "column" }}>
                      <TabPanel value={view} index={0} className="stake-tab-panel">

                      </TabPanel>
                    </Box> */}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

      </div>


    </>

  );
}

export default Ageing;
