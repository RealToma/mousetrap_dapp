import React, {useEffect, useState} from "react";
import { Paper, Button, Grid, Typography, Tab, InputAdornment, OutlinedInput, Tabs, Box, Zoom, Container, useMediaQuery, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import { loadAccountDetails } from "../../slices/AccountSlice";
import { useSelector, useDispatch, useAppSelector } from "react-redux";
import {ethers} from "ethers";
import Mouse from "../../assets/images/mouse.png";
import Cat from "../../assets/images/catlogo.png";
import MouseTrap from "../../assets/images/mousetrap.png";
import TabPanel from "../../components/TabPanel";
import { changeApproval, changeNFTStake, claimRewards } from "../../slices/NFTStakeThunk";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { trim } from "../../helpers";
import { Skeleton } from "@material-ui/lab";


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function getTimeRemaining() {
  if (1640527200 < Math.floor(Date.now() / 1000)){
    return "The Linear Staking Rewards are Over and Unstaking is now Available, thank you!"
  }

  let totalseconds = 1640527200 - Math.floor(Date.now() / 1000)
  var day = 86400;
  var hour = 3600;
  var minute = 60;

  var days = Math.floor(totalseconds / day);
  var hours = Math.floor((totalseconds - days * day)/hour);
  var minutes = Math.floor((totalseconds - days * day - hours * hour)/minute);
  var seconds = totalseconds - days * day - hours * hour - minutes * minute;
  
  if (seconds == 0){
    seconds = 60;
    minutes = minutes - 1
  }

  return `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds left until unstaking is available!`
}

function BreedingLab() {

    const dispatch = useDispatch();

    const smallerScreen = useMediaQuery("(max-width: 650px)");
    const verySmallScreen = useMediaQuery("(max-width: 379px)");
    const [spawnId, setSpawnId] = useState(0);
    const { provider, address, chainID, networkID, connect, connected } = useWeb3Context();
    const [approvalStatus, setApprovalStatus] = useState(false);
    const accountDetails = useSelector(state => state.account)
    const [view, setView] = useState(0);
    const [catView, setCatView] = useState(0);
    const [trapView, setTrapView] = useState(0);
    const [zoomed, setZoomed] = useState(false);
    const [mouseQuantity, setMouseQuantity] = useState(null);
    const [trapQuantity, setTrapQuantity] = useState(null);
    const [catQuantity, setCatQuantity] = useState(null);
    const currentTime = Math.floor(Date.now() / 1000);
    const stakingOpened = 1640527200 > currentTime;    
    const [countdown, setCountdown] = React.useState(<><Skeleton width="150px" style={{margin: "0 auto"}} /></>);

    React.useEffect(() => {
        setTimeout(() => setCountdown(getTimeRemaining()), 1000);
    });
  
    const pendingTransactions = useSelector(state => {
      return state.pendingTransactions;
    });

    const ohmBalance = useSelector(state => {
      return state.account.balances && state.account.balances.ohm;
    });
    const sohmBalance = useSelector(state => {
      return state.account.balances && state.account.balances.sohm;
    });

    const mouseBalance = useSelector(state => {
      return state.account.balances && state.account.balances.mouse
    })

    const catBalance = useSelector(state => {
      return state.account.balances && state.account.balances.cat
    })

    const trapBalance = useSelector(state => {
      return state.account.balances && state.account.balances.trap
    })

    const miceStakedBalance = useSelector(state => {
      return state.account.balances && state.account.balances.miceStakedBalance
    })

    const catStakedBalance = useSelector(state => {
      return state.account.balances && state.account.balances.catStakedBalance
    })

    const trapStakedBalance = useSelector(state => {
      return state.account.balances && state.account.balances.trapStakedBalance
    })

    const micePendingRewards = useSelector(state => {
      return state.account.balances && state.account.balances.micePendingRewards
    })

    const catPendingRewards = useSelector(state => {
      return state.account.balances && state.account.balances.catPendingRewards
    })

    const trapPendingRewards = useSelector(state => {
      return state.account.balances && state.account.balances.trapPendingRewards
    })

    const miceAllowance = useSelector(state => {
      return state.account.staking && state.account.staking.miceAllowance
    })

    const catAllowance = useSelector(state => {
      return state.account.staking && state.account.staking.catAllowance
    })

    const trapAllowance = useSelector(state => {
      return state.account.staking && state.account.staking.trapAllowance
    })

    const miceStaked = useSelector(state => {
      return state.app.miceStaked;
    });

    const catsStaked = useSelector(state => {
      return state.app.catsStaked;
    });

    const trapsStaked = useSelector(state => {
      return state.app.trapsStaked;
    });


    const isAppLoading = useSelector(state => state.app.loading);

    let modalButton = [];

    modalButton.push(
      <Button variant="outlined" color="primary" className="connect-button" onClick={connect} key={1}>
        Connect Wallet
      </Button>,
    );

    useEffect(() => {
      dispatch(loadAccountDetails({ networkID: chainID, address, provider: provider }))
      if(approvalStatus === false) {
        if(accountDetails.minting) {
          setApprovalStatus(accountDetails.minting.mintAllowance.gte(ethers.utils.parseUnits("60", 9)))
        }
      } 
    }, [loadAccountDetails, accountDetails.minting, approvalStatus])

    const onSeekApproval = async token => {
      dispatch(changeApproval({ address, token, provider, networkID: chainID }));
    };

    const onChangeStake = async (action, token, value) => {
      dispatch(changeNFTStake({ action, value, token, provider, address, networkID: chainID }));
    };

    const onChangeClaim = async (token) => {
      dispatch(claimRewards({token, provider, address, networkID: chainID }));
    };


    const changeView = (event, newView) => {
      setView(newView);
    };

    const changeViewTwo = (event, newView) => {
      setCatView(newView);
    };

    const changeViewThree = (event, newView) => {
      setTrapView(newView);
    };

    const isAllowanceDataLoading = ((miceAllowance == null || catAllowance == null || trapAllowance == null) && view === 0)

    
  return (
    <div id="treasury-dashboard-view" className={`${smallerScreen && "smaller"} ${verySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? "0" : "3.3rem",
          paddingRight: smallerScreen || verySmallScreen ? "0" : "3.3rem",
        }}
      >
        <Paper style={{marginTop: "1%", marginBottom: "3%"}}>
          <Typography variant="h2" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>CHEEZ Factory</Typography>
        </Paper>
        <Paper>
          <Typography variant="h5" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%", color: "#3ce8a6", background: "transparent", border: "1px solid #3ce8a6"}}>{countdown}</Typography>
        </Paper>
        <Grid container justifyContent="center" spacing={2} style={{display: "flex", flexDirection: "column"}}>
          <Grid item style={{width: "100%"}}>
            <Paper style={{maxWidth: '100%', display: "flex", flexDirection: "row", justifyContent: "space-evenly"}} onClick={() => {setSpawnId(1)}}>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", maxWidth: "100%", marginTop: "3.5%"}}>
              { <div className="data-row" style={{display: "flex", justifyContent: "center", marginTop: "3.5%"}}>
              {miceStaked ? (
                  <Typography variant="h4">Staked: {miceStaked} / 7487</Typography>
              ) : <Skeleton width="150px" /> }
              </div>  }
              <div className="data-row" style={{display: "flex", justifyContent: "center", marginTop: "3.5%"}}>
                <img src={Mouse} alt="Mouse pixel art" style={{height: "175px", width: "175px"}} />
              </div>
            </div>
            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    {modalButton}
                  </div>
                  <Typography variant="h6">Connect your wallet to stake Mice</Typography>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                  <Typography variant="h3" color="textPrimary" style={{paddingTop: "5%", textAlign: "center"}}>Mice</Typography>

                    <Tabs
                      key={String(zoomed)}
                      centered
                      value={view}
                      style={{color: "#3ce8a6"}}
                      indicatorColor="success"
                      className="stake-tab-buttons"
                      onChange={changeView}
                      aria-label="stake tabs"
                    >
                      <Tab label="Stake" {...a11yProps(0)} />
                      <Tab label="Unstake" {...a11yProps(1)} />
                    </Tabs>

                    <Box className="stake-action-row " display="flex" alignItems="center" style={{display: "flex", flexDirection: "column"}}>
                      {address && !isAllowanceDataLoading ? (
                        (!miceAllowance && view === 0) || (!miceAllowance && view === 1) ? (
                          <Box className="help-text">
                            <Typography variant="body1" className="stake-note" color="textSecondary">
                              {view === 0 ? (
                                <>
                                  First time staking <b>Mice</b>?
                                  <br />
                                  Please approve CheeseDAO to use your <b>Mice</b> for staking.
                                </>
                              ) : (
                                <>
                                  First time unstaking <b>Mice</b>?
                                  <br />
                                  Please approve CheeseDAO to use your <b>Mice</b> for unstaking.
                                </>
                              )}
                            </Typography>
                          </Box>
                        ) : (
                          <FormControl className="cheez-input" variant="outlined" color="primary" style={{width: "70%"}}>
                          </FormControl>
                        )
                      ) : (
                        <Skeleton width="150px" />
                      )}

                      <TabPanel value={view} index={0} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && miceAllowance ? (
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            disabled={isPendingTxn(pendingTransactions, "staking") || !stakingOpened}
                            onClick={() => {
                              onChangeStake("stake", "mice", mouseQuantity);
                            }}
                          >
                            {txnButtonText(pendingTransactions, "staking", "Stake Mice")}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            disabled={isPendingTxn(pendingTransactions, "approve_staking")}
                            onClick={() => {
                              onSeekApproval("mice");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_staking", "Approve")}
                          </Button>
                        )}
                      </TabPanel>
                      <TabPanel value={view} index={1} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address ? (
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            disabled={isPendingTxn(pendingTransactions, "unstaking") || stakingOpened}
                            onClick={() => {
                              onChangeStake("unstake", "mice", 0);
                            }}
                          >
                            {txnButtonText(pendingTransactions, "unstaking", "Unstake Mice")}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            onClick={() => {
                              onSeekApproval("sohm");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}
                          </Button>
                        )}
                      </TabPanel>
                    </Box>
                  </Box>
                </>
              )}
            </div>

            <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", maxWidth: "100%", marginTop: "1.5%"}}>
                    <div className="data-row">
                      <Typography variant="body1" style={{marginBottom: "2%"}}>Your Balance</Typography>
                      <Typography variant="h6" color="textSecondary" style={{marginBottom: "5%"}}>
                        {isAppLoading ? <Skeleton width="80px" /> : <>{mouseBalance} Mice</>}
                      </Typography>
                    </div>

                    <div className="data-row">
                    <Typography variant="body1" style={{marginBottom: "2%"}}>Your Staked Balance</Typography>
                      <Typography variant="h6" color="textSecondary" style={{marginBottom: "5%"}}>
                        {isAppLoading ? <Skeleton width="80px" /> : <>{miceStakedBalance} Mice</>}
                      </Typography>
                    </div>

                    <div className="data-row">
                    <Typography variant="body1" style={{marginBottom: "2%"}}>Claimable CHEEZ</Typography>
                      <Typography variant="h6" color="textSecondary" style={{marginBottom: "5%"}}>
                        {isAppLoading ? <Skeleton width="80px" /> : <>{parseFloat(micePendingRewards).toFixed(9)} CHEEZ</>}
                      </Typography>
                    </div>
                  </div>
            </Paper>
            </Grid>
            <Grid item style={{width: "100%"}}>
            <Paper style={{maxWidth: '100%', display: "flex", flexDirection: "row", justifyContent: "space-evenly"}} onClick={() => {setSpawnId(1)}}>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", maxWidth: "100%", marginTop: "3.5%"}}>
              { <div className="data-row" style={{display: "flex", justifyContent: "center", marginTop: "3.5%"}}>
              {catsStaked ? (
                  <Typography variant="h4">Staked: {catsStaked} / 3317</Typography>
              ) : <Skeleton width="150px" /> }
              </div>  }
              <div className="data-row" style={{display: "flex", justifyContent: "center", marginTop: "3.5%"}}>
                <img src={Cat} alt="Cat pixel art" style={{height: "175px", width: "175px"}} />
              </div>
            </div>

            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    {modalButton}
                  </div>
                  <Typography variant="h6">Connect your wallet to stake Cats</Typography>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                  <Typography variant="h3" color="textPrimary" style={{paddingTop: "5%", textAlign: "center"}}>Cats</Typography>

                    <Tabs
                      key={String(zoomed)}
                      centered
                      value={catView}
                      style={{color: "#3ce8a6"}}
                      indicatorColor="success"
                      className="stake-tab-buttons"
                      onChange={changeViewTwo}
                      aria-label="stake tabs"
                    >
                      <Tab label="Stake" {...a11yProps(0)} />
                      <Tab label="Unstake" {...a11yProps(1)} />
                    </Tabs>

                    <Box className="stake-action-row " display="flex" alignItems="center" style={{display: "flex", flexDirection: "column"}}>
                      {address && !isAllowanceDataLoading ? (
                        (!catAllowance && catView === 0) || (!catAllowance && catView === 1) ? (
                          <Box className="help-text">
                            <Typography variant="body1" className="stake-note" color="textSecondary">
                              {view === 0 ? (
                                <>
                                  First time staking <b>Cats</b>?
                                  <br />
                                  Please approve CheeseDAO to use your <b>Cats</b> for staking.
                                </>
                              ) : (
                                <>
                                  First time unstaking <b>Cats</b>?
                                  <br />
                                  Please approve CheeseDAO to use your <b>Cats</b> for unstaking.
                                </>
                              )}
                            </Typography>
                          </Box>
                        ) : (
                          <FormControl className="cheez-input" variant="outlined" color="primary" style={{width: "70%"}}>
                          </FormControl>
                        )
                      ) : (
                        <Skeleton width="150px" />
                      )}

                      <TabPanel value={catView} index={0} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && catAllowance ? (
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            disabled={isPendingTxn(pendingTransactions, "staking") || !stakingOpened}
                            onClick={() => {
                              onChangeStake("stake", "cats", catQuantity);
                            }}
                          >
                            {txnButtonText(pendingTransactions, "staking", "Stake Cats")}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            disabled={isPendingTxn(pendingTransactions, "approve_staking")}
                            onClick={() => {
                              onSeekApproval("cats");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_staking", "Approve")}
                          </Button>
                        )}
                      </TabPanel>
                      <TabPanel value={catView} index={1} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address ? (
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            disabled={isPendingTxn(pendingTransactions, "unstaking") || stakingOpened}
                            onClick={() => {
                              onChangeStake("unstake", "cats", 0);
                            }}
                          >
                            {txnButtonText(pendingTransactions, "unstaking", "Unstake Cats")}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            onClick={() => {
                              onSeekApproval("sohm");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}
                          </Button>
                        )}
                      </TabPanel>
                    </Box>
                  </Box>
                </>
              )}
            </div>

            <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", maxWidth: "100%", marginTop: "1.5%"}}>
                    <div className="data-row">
                      <Typography variant="body1" style={{marginBottom: "2%"}}>Your Balance</Typography>
                      <Typography variant="h6" color="textSecondary" style={{marginBottom: "5%"}}>
                        {isAppLoading ? <Skeleton width="80px" /> : <>{catBalance} Cats</>}
                      </Typography>
                    </div>

                    <div className="data-row">
                    <Typography variant="body1" style={{marginBottom: "2%"}}>Your Staked Balance</Typography>
                      <Typography variant="h6" color="textSecondary" style={{marginBottom: "5%"}}>
                        {isAppLoading ? <Skeleton width="80px" /> : <>{catStakedBalance} Cats</>}
                      </Typography>
                    </div>

                    <div className="data-row">
                    <Typography variant="body1" style={{marginBottom: "2%"}}>Claimable CHEEZ</Typography>
                      <Typography variant="h6" color="textSecondary" style={{marginBottom: "5%"}}>
                        {isAppLoading ? <Skeleton width="80px" /> : <>{parseFloat(catPendingRewards).toFixed(9)} CHEEZ</>}
                      </Typography>
                    </div>
                  </div>
            </Paper>
            </Grid>

            <Grid item style={{width: "100%"}}>
            <Paper style={{maxWidth: '100%', display: "flex", flexDirection: "row", justifyContent: "space-evenly"}} onClick={() => {setSpawnId(1)}}>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", maxWidth: "100%", marginTop: "3.5%"}}>
              { <div className="data-row" style={{display: "flex", justifyContent: "center", marginTop: "3.5%"}}>
              {trapsStaked ? (
                  <Typography variant="h4">Staked: {trapsStaked} / 1000</Typography>
              ) : <Skeleton width="150px" /> }
              </div>  }
              <div className="data-row" style={{display: "flex", justifyContent: "center", marginTop: "3.5%"}}>
                <img src={MouseTrap} alt="MouseTrap pixel art" style={{height: "175px", width: "175px"}} />
              </div>
            </div>


            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    {modalButton}
                  </div>
                  <Typography variant="h6">Connect your wallet to stake MouseTraps</Typography>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                  <Typography variant="h3" color="textPrimary" style={{paddingTop: "5%", textAlign: "center"}}>MouseTraps</Typography>

                    <Tabs
                      key={String(zoomed)}
                      centered
                      value={trapView}
                      style={{color: "#3ce8a6"}}
                      indicatorColor="success"
                      className="stake-tab-buttons"
                      onChange={changeViewThree}
                      aria-label="stake tabs"
                    >
                      <Tab label="Stake" {...a11yProps(0)} />
                      <Tab label="Unstake" {...a11yProps(1)} />
                    </Tabs>

                    <Box className="stake-action-row " display="flex" alignItems="center" style={{display: "flex", flexDirection: "column"}}>
                      {address && !isAllowanceDataLoading ? (
                        (!trapAllowance && trapView === 0) || (!trapAllowance && trapView === 1) ? (
                          <Box className="help-text">
                            <Typography variant="body1" className="stake-note" color="textSecondary">
                              {view === 0 ? (
                                <>
                                  First time staking <b>Traps</b>?
                                  <br />
                                  Please approve CheeseDAO to use your <b>Traps</b> for staking.
                                </>
                              ) : (
                                <>
                                </>
                              )}
                            </Typography>
                          </Box>
                        ) : (
                          <FormControl className="cheez-input" variant="outlined" color="primary" style={{width: "70%"}}>
                          </FormControl>
                        )
                      ) : (
                        <Skeleton width="150px" />
                      )}

                      <TabPanel value={trapView} index={0} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && trapAllowance ? (
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            disabled={isPendingTxn(pendingTransactions, "staking") || !stakingOpened}
                            onClick={() => {
                              onChangeStake("stake", "traps", trapQuantity);
                            }}
                          >
                            {txnButtonText(pendingTransactions, "staking", "Stake Traps")}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            disabled={isPendingTxn(pendingTransactions, "approve_staking")}
                            onClick={() => {
                              onSeekApproval("traps");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_staking", "Approve")}
                          </Button>
                        )}
                      </TabPanel>
                      <TabPanel value={trapView} index={1} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address ? (
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            disabled={isPendingTxn(pendingTransactions, "unstaking") || stakingOpened}
                            onClick={() => {
                              onChangeStake("unstake", "traps", 0);
                            }}
                          >
                            {txnButtonText(pendingTransactions, "unstaking", "Unstake Traps")}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            onClick={() => {
                              onSeekApproval("sohm");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}
                          </Button>
                        )}
                      </TabPanel>
                    </Box>
                  </Box>
                </>
              )}
            </div>

            <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", maxWidth: "100%", marginTop: "1.5%"}}>
                    <div className="data-row">
                      <Typography variant="body1" style={{marginBottom: "2%"}}>Your Balance</Typography>
                      <Typography variant="h6" color="textSecondary" style={{marginBottom: "5%"}}>
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trapBalance} Traps</>}
                      </Typography>
                    </div>

                    <div className="data-row">
                    <Typography variant="body1" style={{marginBottom: "2%"}}>Your Staked Balance</Typography>
                      <Typography variant="h6" color="textSecondary" style={{marginBottom: "5%"}}>
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trapStakedBalance} Traps</>}
                      </Typography>
                    </div>

                    <div className="data-row">
                    <Typography variant="body1" style={{marginBottom: "2%"}}>Claimable CHEEZ</Typography>
                      <Typography variant="h6" color="textSecondary" style={{marginBottom: "5%"}}>
                        {isAppLoading ? <Skeleton width="80px" /> : <>{parseFloat(trapPendingRewards).toFixed(9)} CHEEZ</>}
                      </Typography>
                    </div>
                  </div>
            </Paper>
            </Grid>


        </Grid>
      </Container>
    </div>
  );
}

export default BreedingLab;
