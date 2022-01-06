import React, {useEffect, useState} from "react";
import { Paper, Button, Grid, Typography, Tab, InputAdornment, OutlinedInput, TextField, Modal, Tabs, Box, Zoom, Container, useMediaQuery, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import { loadAccountDetails } from "../../slices/AccountSlice";
import { useSelector, useDispatch, useAppSelector } from "react-redux";
import {ethers} from "ethers";
import Mouse from "./mouse.png";
import Cat from "./catlogo.png";
import MouseTrap from "./mousetrap.png";
import TabPanel from "../../components/TabPanel";
import { changeApproval, gameStake, gameUnstake, gameClaimRewards } from "../../slices/GameThunk";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { trim } from "../../helpers";
import { Skeleton } from "@material-ui/lab";
import GameTimer from "../../components/GameTimer/GameTimer";
import UnlockTimer from "../../components/GameTimer/UnlockTimer";

import "./Play.css";
import { textAlign } from "@material-ui/system";


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

function Play() {

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
    const [mouseMazeModal, setMouseMazeModal] = useState(false);
    const [mouseStakeAmount, setMouseStakeAmount] = useState(null);
    const [mouseUnstakeAmount, setMouseUnstakeAmount] = useState(null);

    const [catMazeModal, setCatMazeModal] = useState(false);
    const [catStakeAmount, setCatStakeAmount] = useState(null);
    const [catUnstakeAmount, setCatUnstakeAmount] = useState(null);

    const [trapMazeModal, setTrapMazeModal] = useState(false);
    const [trapStakeAmount, setTrapStakeAmount] = useState(null);
    const [trapUnstakeAmount, setTrapUnstakeAmount] = useState(null);

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

    const rewardsMice = useSelector(state => {
      return state.account.game && state.account.game.miceRewards
    })

    const rewardsCats = useSelector(state => {
      return state.account.game && state.account.game.catRewards
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

    const nextCatPool = useSelector(state => {
      return state.app.nextCatPool;
    });

    const myNextReward = useSelector(state => {
      return (parseFloat(state.app.nextMiceReward) * parseFloat(state.account.game && state.account.game.getStakedMice)).toFixed(3)
    });

    const miceReward = useSelector(state => {
      return state.app && state.app.nextMiceReward;
    });



    const isAppLoading = useSelector(state => state.app.loading);

    let modalButton = [];

    modalButton.push(
      <Button variant="outlined" color="primary" className="connect-button" onClick={connect} key={1}>
        Connect Wallet
      </Button>,
    );

    const handleMouseOpen = () => setMouseMazeModal(true);
    const handleMouseClose = () => setMouseMazeModal(false);
    const handleCatClose = () => setCatMazeModal(false);
    const handleTrapClose = () => setTrapMazeModal(false);


    useEffect(() => {
      dispatch(loadAccountDetails({ networkID: chainID, address, provider: provider }))
      if(approvalStatus === false) {
        if(accountDetails.minting) {
          setApprovalStatus(accountDetails.minting.mintAllowance.gte(ethers.utils.parseUnits("60", 9)))
        }
      } 
    }, [loadAccountDetails, accountDetails.minting, approvalStatus])

    const onSeekApproval = async => {
      dispatch(changeApproval({ provider, networkID: chainID }));
    };

    const onStake = async (id, amount) => {
      dispatch(gameStake({ id, amount, provider, networkID: chainID }));
    };

    const onUnstake = async (id, amount) => {
      dispatch(gameUnstake({ id, amount, provider, networkID: chainID}))
    }

    const onClaim = async (id) => {
      dispatch(gameClaimRewards({id, provider, networkID: chainID }));
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

    const stakedMice = useSelector(state => {
      return state.account.game && parseInt(state.account.game.getStakedMice)
    })

    const stakedCats = useSelector(state => {
      return state.account.game && parseInt(state.account.game.getStakedCats)
    })

    const stakedTraps = useSelector(state => {
      return state.account.game && parseInt(state.account.game.getStakedTraps)
    })

    const isGameApproved = useSelector(state => {
      return state.account.minting && state.account.minting.gameAllowance
    })

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
          <Typography variant="h2" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>The Maze</Typography>
        </Paper>
        <Paper style={{background: "transparent"}}>
          <Typography variant="h5" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%", color: "#db0000", border: "1px solid #db0000"}}>Know the risk!  Read about how the game works <span className="hoverHere" onClick={() => {window.open(`https://docs.cheesedao.xyz/components/game-rules`)}}>here</span></Typography>
        </Paper>
        <Grid container justifyContent="center" spacing={2} style={{display: "flex", flexDirection: smallerScreen ? 'column' : 'row'}}>
          <Grid item style={{width: smallerScreen || verySmallScreen ? '85%' : '30%', margin: smallerScreen || verySmallScreen ? '0 auto' : ''}}>
            <Paper style={{maxWidth: '100%', display: "flex", flexDirection: "column", justifyContent: "space-evenly"}} onClick={() => {setSpawnId(1)}}>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", maxWidth: "100%", marginTop: "1.5%"}}>
              {/* { <div className="data-row" style={{display: "flex", justifyContent: "center", marginTop: "3.5%"}}>
              {miceStaked ? (
                  <Typography variant="h4">Staked: {miceStaked} / 7487</Typography>
              ) : <Skeleton width="150px" /> }
              </div>  } */}
              <div className="data-row" style={{display: "flex", justifyContent: "center"}}>
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
                </>
              )}
            </div>

            <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", maxWidth: "100%", marginTop: "1.5%"}}>

                    <div className="data-row">
                    {mouseBalance != undefined || null ? (
                    <Typography variant="body1" style={{marginBottom: "2%", textAlign: "center"}}>You have <span style={{color: "#ebc50c"}}>{mouseBalance} {mouseBalance > 1 ? 'Mice' : 'Mouse'}</span> ready for the Maze</Typography>
                    ) : (<></>)}
                    </div>

                    <div className="data-row">
                      {stakedMice != null || undefined ? (
                      <Typography variant="body1" style={{marginBottom: "2%", textAlign: "center"}}>You have <span style={{color: "#ebc50c"}}>{stakedMice} {stakedMice > 1 ? 'Mice' : 'Mouse'}</span> in the Maze</Typography>
                      ) : (
                        <></>
                      )}
                    </div>

                    <div className="data-row">
                    {rewardsMice != undefined && stakedMice != undefined ? (
                      <Typography variant="body1" style={{marginBottom: "2%", textAlign: "center"}}>Your {stakedMice > 1 ? 'Mice have' : 'Mouse has'} found <span style={{color: "#ebc50c"}}>{parseFloat(ethers.utils.formatUnits(rewardsMice, 9).toString()).toFixed(3)}</span> CHEEZ in the Maze</Typography>
                    ) : (
                      <></>
                    )}
                    </div>

                    <div className="data-row">
                      {miceReward != undefined && stakedMice != undefined ? (
                      <Typography variant="body1" style={{marginBottom: "2%", textAlign: "center"}}>
                        My next reward is {myNextReward}🧀 ({miceReward} 🧀/ Mouse)
                      </Typography>
                      ) : (
                        <Skeleton style={{margin: "0 auto", width: "25px"}} /> 
                      )}
                    </div>


                    <Box style={{width: "100%", margin: "0 auto", marginTop: "7.5%", marginBottom: '4.5%', paddingLeft: "5%", paddingRight: "5%"}}>
                      <Button
                        className="stake-button"
                        variant="outlined"
                        color="primary"
                        style={{marginBottom: "2%", marginRight: "2%"}}
                        onClick={() => {
                          setMouseMazeModal(true)
                        }}
                      >
                        Enter the Maze
                      </Button>
                    </Box>
                    <div style={{paddingLeft: "5%", paddingBottom: "2.5%"}}>
                      <GameTimer />
                    </div>
                    <Modal
                      open={mouseMazeModal}
                      onClose={handleMouseClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                      style={{width: smallerScreen || verySmallScreen ? '90%' : '40%', margin: "0 auto", marginTop: "1%", overFlow: "scroll"}}
                    >
                      <Box>
                        <Paper style={{paddingTop: "2%"}}>
                        <Paper style={{background: "transparent", width: "85%", margin: "0 auto"}}>
                          <Typography variant="h3" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>The Maze</Typography>
                        </Paper>
                        <Box>
                        {smallerScreen || verySmallScreen ? (
                          <Box>
                            {smallerScreen || verySmallScreen ? (
                              <></>
                            ) : (
                              <Typography variant="h5" color="textSecondary" style={{textAlign: "center", paddingTop: ".75%", paddingBottom: ".75%", marginTop: "1%", color: "#ff0000"}}>Caution!</Typography>
                            )}
                            <Box style={{display: "flex", flexDirection: "column"}}>
                              <Typography variant="body1" color="textSecondary" style={{textAlign: "center", paddingTop: ".75%", paddingBottom: "1%", color: "#ff0000", width: "60%", margin: "0 auto"}}>Entering the Maze is not without risk!</Typography>
                              {verySmallScreen ? (
                                <></>
                              ) : (
                                <Typography variant="body1" color="textSecondary" style={{textAlign: "center", paddingTop: ".75%", paddingBottom: "3%", color: "#ff0000", width: "60%", margin: "0 auto"}}>Make sure you understand:</Typography>
                              )}
                            </Box>
                          </Box>
                        ) : (
                          <Box>
                          <Typography variant="h3" color="textSecondary" style={{textAlign: "center", paddingTop: ".75%", paddingBottom: ".75%", marginTop: "1%", color: "#ff0000"}}>Caution!</Typography>
                          <Typography variant="h6" color="textSecondary" style={{textAlign: "center", paddingTop: ".75%", paddingBottom: "3%", color: "#ff0000", width: "60%", margin: "0 auto"}}>Entering the Maze is not without risk!  <br />Make sure you understand the following:</Typography>
                          </Box>
                        )}
                          <Box>
                          {smallerScreen || verySmallScreen ? (
                            <Box style={{display: "flex", flexDirection: "column", width: "100%"}}>
                              <Box>
                                <Typography variant="body1" color="textSecondary" style={{textAlign: "center", paddingTop: ".75%", paddingBottom: "3%", color: "#e06565", width: "60%", margin: "0 auto", textAlign: "left"}}>🧀 You have a 5% chance of losing your Mouse to a MouseTrap when unstaking</Typography>
                                <Typography variant="body1" color="textSecondary" style={{textAlign: "center", paddingTop: ".75%", paddingBottom: "3%", color: "#e06565", width: "60%", margin: "0 auto", textAlign: "left"}}>🧀 You have a 45% chance of losing your CHEEZ rewards to Cats when unstaking</Typography>
                              </Box>
                              <Box>
                                <Typography variant="body1" color="textSecondary" style={{textAlign: "center", paddingTop: ".75%", paddingBottom: "3%", color: "#e06565", width: "60%", margin: "0 auto", textAlign: "left"}}>🧀 Claiming rewards has a 25% extortion fee paid to Cats</Typography>
                                <Typography variant="body1" color="textSecondary" style={{textAlign: "center", paddingTop: ".75%", paddingBottom: "3%", color: "#e06565", width: "60%", margin: "0 auto", textAlign: "left"}}>🧀 Unstaking requires 2 days worth of unclaimed rewards</Typography>
                              </Box>
                              <Box>
                                <Typography variant="body1" color="textSecondary" style={{textAlign: "center", paddingTop: ".75%", paddingBottom: "3%", color: "#e06565", width: "60%", margin: "0 auto", textAlign: "left"}}>🧀 Staking additional Mice will claim rewards and reset your 2-day staking lockup</Typography>
                              </Box>
                            </Box>
                          ) : (
                            <Box>
                              <Typography variant="body1" color="textSecondary" style={{textAlign: "center", paddingTop: ".75%", paddingBottom: "3%", color: "#e06565", width: "60%", margin: "0 auto", textAlign: "left"}}>🧀 You have a 5% chance of losing your Mouse to a MouseTrap when unstaking</Typography>
                              <Typography variant="body1" color="textSecondary" style={{textAlign: "center", paddingTop: ".75%", paddingBottom: "3%", color: "#e06565", width: "60%", margin: "0 auto", textAlign: "left"}}>🧀 You have a 45% chance of losing your CHEEZ rewards to Cats when unstaking</Typography>
                              <Typography variant="body1" color="textSecondary" style={{textAlign: "center", paddingTop: ".75%", paddingBottom: "3%", color: "#e06565", width: "60%", margin: "0 auto", textAlign: "left"}}>🧀 Claiming rewards has a 25% extortion fee paid to Cats</Typography>
                              <Typography variant="body1" color="textSecondary" style={{textAlign: "center", paddingTop: ".75%", paddingBottom: "3%", color: "#e06565", width: "60%", margin: "0 auto", textAlign: "left"}}>🧀 Unstaking requires 2 days worth of unclaimed rewards</Typography>
                              <Typography variant="body1" color="textSecondary" style={{textAlign: "center", paddingTop: ".75%", paddingBottom: "3%", color: "#e06565", width: "60%", margin: "0 auto", textAlign: "left"}}>🧀 Staking additional Mice will claim rewards and reset your 2-day staking lockup</Typography>
                            </Box>
                          )}
                          </Box>
                        </Box>
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
                        <Box style={{display: "flex", justifyContent: "center"}}>
                        <TabPanel value={view} index={0} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && isGameApproved ? (
                          <Box style={{display: "flex" , flexDirection: "column", justifyContent: "center"}}>
                            <TextField
                            id="filled-number"
                            label={`Max Available: ${mouseBalance}`}
                            type="number"
                            value={mouseStakeAmount}
                            onChange={(e) => {setMouseStakeAmount(e.target.value)}}
                            style={{marginBottom: "5%"}}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            variant="outlined"
                          />
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            disabled={isPendingTxn(pendingTransactions, "game_stake")}
                            onClick={() => {
                              onStake(0, mouseStakeAmount);
                            }}
                          >
                            {txnButtonText(pendingTransactions, "Entering Maze", "Stake Mice")}
                          </Button>
                          </Box>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            disabled={isPendingTxn(pendingTransactions, "approve_game")}
                            onClick={onSeekApproval}
                          >
                            {txnButtonText(pendingTransactions, "approve_game", "Approve")}
                          </Button>
                        )}
                      </TabPanel>
                      <TabPanel value={view} index={1} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address ? (
                          <Box style={{display: "flex" , flexDirection: "column", justifyContent: "center"}}>
                            <TextField
                            id="filled-number"
                            label={`Max Available: ${stakedMice}`}
                            type="number"
                            value={mouseUnstakeAmount}
                            onChange={(e) => {setMouseUnstakeAmount(e.target.value)}}
                            style={{marginBottom: "5%"}}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            variant="outlined"
                          />
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            disabled={isPendingTxn(pendingTransactions, "unstaking")}
                            onClick={() => {
                              onUnstake(0, mouseUnstakeAmount);
                            }}
                          >
                            {txnButtonText(pendingTransactions, "Leaving Maze", "Unstake Mice")}
                          </Button>
                          {/* <Box>
                          <Typography variant="body1" style={{marginBottom: "2%", textAlign: "center"}}>You have left until you can unstake</Typography>
                            </Box> */}
                          </Box>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            onClick={onSeekApproval}
                          >
                            {txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}
                          </Button>
                        )}
                      <div style={{paddingLeft: "5%", paddingBottom: "2.5%"}}>
                        <UnlockTimer />
                      </div>
                      </TabPanel>
                      </Box>
                      <Box style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                        {stakedMice != undefined && rewardsMice != undefined ? (
                        <Typography variant="body1" style={{marginBottom: "3%", textAlign: "center"}}>Your {stakedMice > 1 ? 'Mice have' : 'Mouse has'} found <span style={{color: "#ebc50c"}}>{parseFloat(ethers.utils.formatUnits(rewardsMice, 9).toString()).toFixed(3)}</span> CHEEZ in the Maze</Typography>
                        ) : (
                          <Skeleton style={{margin: "0 auto", width: "25px"}} />
                        )}
                        <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "game_claim")}
                            style={{margin: "0 auto", marginBottom: "5%", width: "50%"}}
                            onClick={() => {
                              onClaim(0);
                            }}
                          >
                            {txnButtonText(pendingTransactions, "game_claim", "Claim Rewards")}
                          </Button>
                      </Box>
                        </Paper>
                      </Box>
                    </Modal>
                  </div>
            </Paper>
            </Grid>
            <Grid item style={{width: smallerScreen ? '85%' : '30%', margin: smallerScreen ? '0 auto' : ''}}>
            <Paper style={{maxWidth: '100%', display: "flex", flexDirection: "column", justifyContent: "space-evenly"}} onClick={() => {setSpawnId(1)}}>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", maxWidth: "100%", marginTop: "1.5%"}}>
              {/* { <div className="data-row" style={{display: "flex", justifyContent: "center", marginTop: "3.5%"}}>
              {miceStaked ? (
                  <Typography variant="h4">Staked: {miceStaked} / 7487</Typography>
              ) : <Skeleton width="150px" /> }
              </div>  } */}
              <div className="data-row" style={{display: "flex", justifyContent: "center"}}>
                <img src={Cat} alt="cat pixel art" style={{height: "175px", width: "175px"}} />
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
                </>
              )}
            </div>

            <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", maxWidth: "100%", marginTop: "1.5%"}}>

                    <div className="data-row">
                      {catBalance ? (
                    <Typography variant="body1" style={{marginBottom: "2%", textAlign: "center"}}>You have <span style={{color: "#ebc50c"}}>{catBalance} {catBalance > 1 ? 'Cats' : 'Cat'}</span> ready for the Maze</Typography>
                      ) : (<></>)}
                    </div>

                    <div className="data-row">
                      {stakedCats != undefined ? (
                      <Typography variant="body1" style={{marginBottom: "2%", textAlign: "center"}}>You have <span style={{color: "#ebc50c"}}>{stakedCats} {stakedCats > 1 ? 'Cats' : 'Cat'}</span> in the Maze</Typography>
                      ) : (
                        <></>
                      )}
                    </div>

                    <div className="data-row">
                    {rewardsCats != undefined && stakedCats != undefined ? (
                      <Typography variant="body1" style={{marginBottom: "2%", textAlign: "center"}}>Your {stakedCats > 1 ? 'Cats have' : 'Cat has'} found <span style={{color: "#ebc50c"}}>{parseFloat(ethers.utils.formatUnits(rewardsCats, 9).toString()).toFixed(3)}</span> CHEEZ in the Maze</Typography>
                    ) : (
                      <Skeleton style={{margin: "0 auto", width: "25px"}} /> 
                    )}                    
                    </div>

                    <div className="data-row">
                      {nextCatPool != undefined ? (
                      <Typography variant="body1" style={{marginBottom: "2%", textAlign: "center"}}>
                        The Cat Pool has {nextCatPool}🧀
                      </Typography>
                      ) : (
                        <Skeleton style={{margin: "0 auto", width: "25px"}} /> 
                      )}
                    </div>

                    <Box style={{width: "100%", margin: "0 auto", marginTop: "12.5%", marginBottom: '10.5%', paddingLeft: "5%", paddingRight: "5%"}}>
                      <Button
                        className="stake-button"
                        variant="outlined"
                        color="primary"
                        style={{marginBottom: "2%", marginRight: "2%"}}
                        onClick={() => {
                          setCatMazeModal(true)
                          setMouseMazeModal(false)
                          setTrapMazeModal(false)
                        }}
                      >
                        Enter the Maze
                      </Button>
                    </Box>
                    <Modal
                      open={catMazeModal}
                      onClose={handleCatClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                      style={{width: smallerScreen || verySmallScreen ? '85%' : '40%', margin: "0 auto", marginTop: smallerScreen || verySmallScreen ? '15%' : '5%'}}
                    >
                      <Box>
                        <Paper style={{paddingTop: "2%"}}>
                        <Paper style={{background: "transparent", width: "85%", margin: "0 auto"}}>
                          <Typography variant="h3" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>The Maze</Typography>
                        </Paper>
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
                        <Box style={{display: "flex", justifyContent: "center"}}>
                        <TabPanel value={view} index={0} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && isGameApproved ? (
                          <Box style={{display: "flex" , flexDirection: "column", justifyContent: "center"}}>
                            <TextField
                            id="filled-number"
                            label={`Max Available: ${catBalance}`}
                            type="number"
                            value={catStakeAmount}
                            onChange={(e) => {setCatStakeAmount(e.target.value)}}
                            style={{marginBottom: "5%"}}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            variant="outlined"
                          />
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            disabled={isPendingTxn(pendingTransactions, "game_stake")}
                            onClick={() => {
                              onStake(1, catStakeAmount);
                            }}
                          >
                            {txnButtonText(pendingTransactions, "Entering Maze", "Stake Cats")}
                          </Button>
                          </Box>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            disabled={isPendingTxn(pendingTransactions, "approve_game")}
                            onClick={onSeekApproval}
                          >
                            {txnButtonText(pendingTransactions, "approve_game", "Approve")}
                          </Button>
                        )}
                      </TabPanel>
                      <TabPanel value={view} index={1} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address ? (
                          <Box style={{display: "flex" , flexDirection: "column", justifyContent: "center"}}>
                            <TextField
                            id="filled-number"
                            label={`Max Available: ${stakedCats}`}
                            type="number"
                            value={catUnstakeAmount}
                            onChange={(e) => {setCatUnstakeAmount(e.target.value)}}
                            style={{marginBottom: "5%"}}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            variant="outlined"
                          />
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            disabled={isPendingTxn(pendingTransactions, "game_unstake")}
                            onClick={() => {
                              onUnstake(1, catUnstakeAmount);
                            }}
                          >
                            {txnButtonText(pendingTransactions, "Leaving Maze", "Unstake Cats")}
                          </Button>
                          </Box>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            onClick={onSeekApproval}
                          >
                            {txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}
                          </Button>
                        )}
                      </TabPanel>
                      </Box>
                      <Box style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                        {catBalance != null || undefined ? (
                        <Typography variant="body1" style={{marginBottom: "3%", textAlign: "center"}}>Your {catBalance > 1 ? 'Cats have' : 'Cat has'} found <span style={{color: "#ebc50c"}}>{parseFloat(ethers.utils.formatUnits(rewardsCats, 9).toString()).toFixed(3)}</span> CHEEZ in the Maze</Typography>
                        ) : (<></>)}

                        <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "game_claim")}
                            style={{margin: "0 auto", marginBottom: "5%", width: "50%"}}
                            onClick={() => {
                              onClaim(1);
                            }}
                          >
                            {txnButtonText(pendingTransactions, "game_claim", "Claim Rewards")}
                          </Button>
                      </Box>
                        </Paper>
                      </Box>
                    </Modal>
                  </div>
            </Paper>
            </Grid>
  
            <Grid item style={{width: smallerScreen ? '85%' : '30%', margin: smallerScreen ? '0 auto' : ''}}>
            <Paper style={{maxWidth: '100%', display: "flex", flexDirection: "column", justifyContent: "space-evenly"}} onClick={() => {setSpawnId(1)}}>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", maxWidth: "100%", marginTop: "1.5%"}}>
              {/* { <div className="data-row" style={{display: "flex", justifyContent: "center", marginTop: "3.5%"}}>
              {miceStaked ? (
                  <Typography variant="h4">Staked: {miceStaked} / 7487</Typography>
              ) : <Skeleton width="150px" /> }
              </div>  } */}
              <div className="data-row" style={{display: "flex", justifyContent: "center"}}>
                <img src={MouseTrap} alt="cat pixel art" style={{height: "175px", width: "175px"}} />
              </div>
            </div>
            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    {modalButton}
                  </div>
                  <Typography variant="h6">Connect your wallet to stake Traps</Typography>
                </div>
              ) : (
                <>
                </>
              )}
            </div>

            <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", maxWidth: "100%", marginTop: "1.5%"}}>

                    <div className="data-row">
                      {trapBalance != null || undefined ? (
                    <Typography variant="body1" style={{marginBottom: "8%", textAlign: "center"}}>You have <span style={{color: "#ebc50c"}}>{trapBalance} {trapBalance > 1 ? 'Traps' : 'Trap'}</span> ready for the Maze</Typography>
                      ) : (<></>)}
                    </div>

                    <div className="data-row">
                      {stakedTraps != undefined ? (
                      <Typography variant="body1" style={{marginBottom: "2%", textAlign: "center"}}>You have <span style={{color: "#ebc50c"}}>{stakedTraps} {stakedTraps > 1 ? 'Traps' : 'Trap'}</span> in the Maze</Typography>
                      ) : (
                        <Skeleton style={{margin: "0 auto", width: "25px"}} />
                      )}
                    </div>

                    <Box style={{width: "100%", margin: "0 auto", marginTop: "12.5%", paddingTop: "7.5%",  marginBottom: '10.5%', paddingLeft: "5%", paddingRight: "5%"}}>
                      <Button
                        className="stake-button"
                        variant="outlined"
                        color="primary"
                        style={{marginBottom: "2%", marginRight: "2%"}}
                        onClick={() => {
                          setTrapMazeModal(true)
                          setMouseMazeModal(false)
                          setCatMazeModal(false)
                        }}
                      >
                        Enter the Maze
                      </Button>
                    </Box>
                    <Modal
                      open={trapMazeModal}
                      onClose={handleTrapClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                      style={{width: smallerScreen || verySmallScreen ? '85%' : "40%", margin: "0 auto", marginTop: smallerScreen || verySmallScreen ? '15%' : '5%'}}
                    >
                      <Box>
                        <Paper style={{paddingTop: "2%"}}>
                        <Paper style={{background: "transparent", width: "85%", margin: "0 auto"}}>
                          <Typography variant="h3" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>The Maze</Typography>
                        </Paper>
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
                        <Box style={{display: "flex", justifyContent: "center"}}>
                        <TabPanel value={view} index={0} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && isGameApproved ? (
                          <Box style={{display: "flex" , flexDirection: "column", justifyContent: "center"}}>
                            <TextField
                            id="filled-number"
                            label={`Max Available: ${trapBalance}`}
                            type="number"
                            value={trapStakeAmount}
                            onChange={(e) => {setTrapStakeAmount(e.target.value)}}
                            style={{marginBottom: "5%"}}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            variant="outlined"
                          />
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            disabled={isPendingTxn(pendingTransactions, "game_stake")}
                            onClick={() => {
                              onStake(2, trapStakeAmount);
                            }}
                          >
                            {txnButtonText(pendingTransactions, "Entering Maze", "Stake Traps")}
                          </Button>
                          </Box>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            disabled={isPendingTxn(pendingTransactions, "approve_game")}
                            onClick={onSeekApproval}
                          >
                            {txnButtonText(pendingTransactions, "approve_game", "Approve")}
                          </Button>
                        )}
                      </TabPanel>
                      <TabPanel value={view} index={1} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address ? (
                          <Box style={{display: "flex" , flexDirection: "column", justifyContent: "center"}}>
                            <TextField
                            id="filled-number"
                            label={`Max Available: ${stakedTraps}`}
                            type="number"
                            value={trapUnstakeAmount}
                            onChange={(e) => {setTrapUnstakeAmount(e.target.value)}}
                            style={{marginBottom: "5%"}}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            variant="outlined"
                          />
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            disabled={isPendingTxn(pendingTransactions, "game_unstake")}
                            onClick={() => {
                              onUnstake(2, trapUnstakeAmount);
                            }}
                          >
                            {txnButtonText(pendingTransactions, "Leaving Maze", "Unstake Traps")}
                          </Button>
                          </Box>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="outlined"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                            style={{marginBottom: "2%", marginRight: "2%"}}
                            onClick={onSeekApproval}
                          >
                            {txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}
                          </Button>
                        )}
                      </TabPanel>
                      </Box>
                        </Paper>
                      </Box>
                    </Modal>
                  </div>
            </Paper>
            </Grid>


        </Grid>
      </Container>
    </div>
  );
}

export default Play;
