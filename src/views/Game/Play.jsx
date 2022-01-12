import React, { useEffect, useState } from "react";
import { Paper, Button, Grid, Typography, Tab, InputAdornment, OutlinedInput, TextField, Tabs, Box, Zoom, Container, useMediaQuery, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import { loadAccountDetails } from "../../slices/AccountSlice";
import { useSelector, useDispatch, useAppSelector } from "react-redux";
import { ethers } from "ethers";
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
import { Col, Row, Modal } from "react-bootstrap";


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function getTimeRemaining() {
  if (1640527200 < Math.floor(Date.now() / 1000)) {
    return "The Linear Staking Rewards are Over and Unstaking is now Available, thank you!"
  }

  let totalseconds = 1640527200 - Math.floor(Date.now() / 1000)
  var day = 86400;
  var hour = 3600;
  var minute = 60;

  var days = Math.floor(totalseconds / day);
  var hours = Math.floor((totalseconds - days * day) / hour);
  var minutes = Math.floor((totalseconds - days * day - hours * hour) / minute);
  var seconds = totalseconds - days * day - hours * hour - minutes * minute;

  if (seconds == 0) {
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
  const [countdown, setCountdown] = React.useState(<><Skeleton width="150px" style={{ margin: "0 auto" }} /></>);
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
    // <Button variant="outlined" color="primary" className="connect-button" onClick={connect} key={1}>
    //   Connect Wallet
    // </Button>,
    <Button className="wallet-btn mt-5" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const handleMouseOpen = () => setMouseMazeModal(true);
  const handleMouseClose = () => setMouseMazeModal(false);
  const handleCatClose = () => setCatMazeModal(false);
  const handleTrapClose = () => setTrapMazeModal(false);


  useEffect(() => {
    dispatch(loadAccountDetails({ networkID: chainID, address, provider: provider }))
    if (approvalStatus === false) {
      if (accountDetails.minting) {
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
    dispatch(gameUnstake({ id, amount, provider, networkID: chainID }))
  }

  const onClaim = async (id) => {
    dispatch(gameClaimRewards({ id, provider, networkID: chainID }));
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

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [tabActive, setTabActive] = useState(1);

  return (
    <>
      <div className="play-main px-3">
        <Row>
          <Col lg={12}>
            <div className="cheese-docs p-5">
              <p className="mb-0">Know the risk! Read about how the game works <span className="hoverHere" onClick={() => { window.open(`https://docs.cheesedao.xyz/components/game-rules`) }}>here</span></p>
              <Button className="cheese-btn">CheeseDao Docs</Button>
            </div>
          </Col>
        </Row>
        <Row className="mt-5 justify-content-center mb-5">
          <Col lg={4} md={6} sm={12} className="mt-3">
            <div className="yellow-play text-center">

              <img src={require('./mouse.png').default} alt="" width={150} />
              {!address ? (
                <p>Connect your wallet to stake Mice</p>
              ) : (
                <>
                  <div className="data-row mt-3">
                    {mouseBalance != undefined || null ? (
                      <>
                        <div className="data-sub mt-2">
                          <span>Ready for the Maze</span>
                          <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _  _</span>
                          <span>{mouseBalance} {mouseBalance > 1 ? 'Mice' : 'Mouse'}</span>
                        </div>
                      </>) : (<></>)}
                  </div>

                  <div className="data-row">
                    {stakedMice != null || undefined ? (
                      <>
                        <div className="data-sub">
                          <span>In the Maze</span>
                          <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _  _ _ __ _  _</span>
                          <span>{stakedMice} {stakedMice > 1 ? 'Mice' : 'Mouse'}</span>
                        </div>
                      </>) : (
                      <></>
                    )}
                  </div>

                  <div className="data-row">
                    {rewardsMice != undefined && stakedMice != undefined ? (
                      <>
                        <div className="data-sub">
                          <span>CHEEZ in the Maze</span>
                          <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _  _</span>
                          <span>{stakedMice > 1 ? 'Mice have' : 'Mouse has'}</span>
                        </div>
                      </>) : (
                      <></>
                    )}
                  </div>

                  <div className="data-row">
                    {miceReward != undefined && stakedMice != undefined ? (
                      <>
                        <div className="data-sub">
                          <span>My next reward is</span>
                          <span>_ _ _ _ _ _  _</span>
                          <span>{myNextReward}🧀 ({miceReward} 🧀/ Mouse)</span>
                        </div>
                      </>
                    ) : (
                      <Skeleton style={{ margin: "0 auto", width: "25px" }} />
                    )}
                  </div>
                </>
              )}

              <Button
                className="wallet-btn mt-5"
                onClick={handleShow}
              >
                Enter the Maze
              </Button>

              <Modal show={show} onHide={handleClose}>
                <Modal.Body className="modal-bg-main">
                  <div >
                    <Box className="stake-action-area border-bot">
                      <Tabs
                        key={String(zoomed)}
                        centered
                        value={view}
                        textColor="primary"
                        indicatorColor="primary"
                        className="stake-tab-buttons"
                        // onChange={changeView}
                        aria-label="stake tabs"
                      >
                        <Tab className={`${tabActive === 1 ? "active" : ""} green`} label="Stake" {...a11yProps(0)} onClick={() => setTabActive(1)} />
                        <Tab className={`${tabActive === 2 ? "active" : ""} pink`} label="Unstake" {...a11yProps(1)} onClick={() => setTabActive(2)} />
                      </Tabs>
                    </Box>
                    <div className="search-bar mt-3 px-3">
                      <span>Max Available: 0</span>
                      <div className="d-flex align-items-center gap">
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
                    <p>Your Cat has found</p>
                    <Box style={{ width: "fit-content", marginTop: '15px', marginBottom: "15px" }} >
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

                    </Box>
                  </div>
                </Modal.Body>
              </Modal>

            </div>
          </Col>
          <Col lg={4} md={6} sm={12} className="mt-3">
            <div className="yellow-play text-center">
              <img src={require('./cat.png').default} alt="" width={150} />
              {!address ? (
                <p>Connect your wallet to stake Cats</p>
              ) : (
                <>
                  <div className="data-row mt-3">
                    {catBalance ? (
                      <>
                        <div className="data-sub">
                          <span>ready for the Maze</span>
                          <span>_ _ _ _ _ _  _</span>
                          <span>{catBalance} {catBalance > 1 ? 'Cats' : 'Cat'}</span>
                        </div>
                      </>
                    ) : (<></>)}
                  </div>

                  <div className="data-row">
                    {stakedCats != undefined ? (
                      <>
                        <div className="data-sub">
                          <span>in the Maze</span>
                          <span>_ _ _ _ _ _  _</span>
                          <span>{stakedCats} {stakedCats > 1 ? 'Cats' : 'Cat'}</span>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>

                  <div className="data-row">
                    {rewardsCats != undefined && stakedCats != undefined ? (
                      <>
                        <div className="data-sub">
                          <span>CHEEZ in the Maze</span>
                          <span>_ _ _ _ _ _  _</span>
                          <span>{parseFloat(ethers.utils.formatUnits(rewardsCats, 9).toString()).toFixed(3)}</span>
                        </div>
                      </>
                    ) : (
                      <Skeleton style={{ margin: "0 auto", width: "25px" }} />
                    )}
                  </div>

                  <div className="data-row">
                    {nextCatPool != undefined ? (
                      <>
                        <div className="data-sub">
                          <span>The Cat Pool has </span>
                          <span>_ _ _ _ _ _  _</span>
                          <span>{nextCatPool}🧀</span>
                        </div>
                      </>
                    ) : (
                      <Skeleton style={{ margin: "0 auto", width: "25px" }} />
                    )}
                  </div>
                </>
              )}

              <Button
                className="wallet-btn mt-5"
                onClick={handleShow}
              >
                Enter the Maze
              </Button>

              <Modal show={show} onHide={handleClose}>
                <Modal.Body className="modal-bg-main">
                  <div >
                    <Box className="stake-action-area border-bot">
                      <Tabs
                        key={String(zoomed)}
                        centered
                        value={view}
                        textColor="primary"
                        indicatorColor="primary"
                        className="stake-tab-buttons"
                        // onChange={changeView}
                        aria-label="stake tabs"
                      >
                        <Tab className={`${tabActive === 1 ? "active" : ""} green`} label="Stake" {...a11yProps(0)} onClick={() => setTabActive(1)} />
                        <Tab className={`${tabActive === 2 ? "active" : ""} pink`} label="Unstake" {...a11yProps(1)} onClick={() => setTabActive(2)} />
                      </Tabs>
                    </Box>
                    <div className="search-bar mt-3 px-3">
                      <span>Max Available: 0</span>
                      <div className="d-flex align-items-center gap">
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
                    <p>Your Cat has found</p>
                    <Box style={{ width: "fit-content", marginTop: '15px', marginBottom: "15px" }} >
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

                    </Box>
                  </div>
                </Modal.Body>
              </Modal>

              <Modal
                open={catMazeModal}
                onClose={handleCatClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ width: smallerScreen || verySmallScreen ? '85%' : '40%', margin: "0 auto", marginTop: smallerScreen || verySmallScreen ? '15%' : '5%' }}
              >
                <Box>
                  <Paper style={{ paddingTop: "2%" }}>
                    <Paper style={{ background: "transparent", width: "85%", margin: "0 auto" }}>
                      <Typography variant="h3" color="textSecondary" style={{ textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%" }}>The Maze</Typography>
                    </Paper>
                    <Tabs
                      key={String(zoomed)}
                      centered
                      value={view}
                      style={{ color: "#3ce8a6" }}
                      indicatorColor="success"
                      className="stake-tab-buttons"
                      onChange={changeView}
                      aria-label="stake tabs"
                    >
                      <Tab label="Stake" {...a11yProps(0)} />
                      <Tab label="Unstake" {...a11yProps(1)} />
                    </Tabs>
                    <Box style={{ display: "flex", justifyContent: "center" }}>
                      <TabPanel value={view} index={0} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && isGameApproved ? (
                          <Box style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <TextField
                              id="filled-number"
                              label={`Max Available: ${catBalance}`}
                              type="number"
                              value={catStakeAmount}
                              onChange={(e) => { setCatStakeAmount(e.target.value) }}
                              style={{ marginBottom: "5%" }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              variant="outlined"
                            />
                            <Button
                              className="stake-button"
                              variant="outlined"
                              color="primary"
                              style={{ marginBottom: "2%", marginRight: "2%" }}
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
                            style={{ marginBottom: "2%", marginRight: "2%" }}
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
                          <Box style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <TextField
                              id="filled-number"
                              label={`Max Available: ${stakedCats}`}
                              type="number"
                              value={catUnstakeAmount}
                              onChange={(e) => { setCatUnstakeAmount(e.target.value) }}
                              style={{ marginBottom: "5%" }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              variant="outlined"
                            />
                            <Button
                              className="stake-button"
                              variant="outlined"
                              color="primary"
                              style={{ marginBottom: "2%", marginRight: "2%" }}
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
                            style={{ marginBottom: "2%", marginRight: "2%" }}
                            onClick={onSeekApproval}
                          >
                            {txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}
                          </Button>
                        )}
                      </TabPanel>
                    </Box>
                    <Box style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      {catBalance != null || undefined ? (
                        <Typography variant="body1" style={{ marginBottom: "3%", textAlign: "center" }}>Your {catBalance > 1 ? 'Cats have' : 'Cat has'} found <span style={{ color: "#ebc50c" }}>{parseFloat(ethers.utils.formatUnits(rewardsCats, 9).toString()).toFixed(3)}</span> CHEEZ in the Maze</Typography>
                      ) : (<></>)}

                      <Button
                        className="stake-button"
                        variant="outlined"
                        color="primary"
                        disabled={isPendingTxn(pendingTransactions, "game_claim")}
                        style={{ margin: "0 auto", marginBottom: "5%", width: "50%" }}
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
          </Col>
          <Col lg={4} md={6} sm={12} className="mt-3">
            <div className="yellow-play text-center">
              <img src={require('./mouse-trap.png').default} alt="" width={150} />

              {!address ? (
                <p>Connect your wallet to stake Traps</p>
              ) : (
                <>
                  <div className="data-row mt-3">
                    {trapBalance != null || undefined ? (
                      <>
                        <div className="data-sub">
                          <span>ready for the Maze</span>
                          <span>_ _ _ _ _ _  _</span>
                          <span>{trapBalance} {trapBalance > 1 ? 'Traps' : 'Trap'}</span>
                        </div>
                      </>
                    ) : (<></>)}
                  </div>

                  <div className="data-row">
                    {stakedTraps != undefined ? (
                      <>
                        <div className="data-sub">
                          <span>in the Maze</span>
                          <span>_ _ _ _ _ _  _</span>
                          <span>{stakedTraps} {stakedTraps > 1 ? 'Traps' : 'Trap'}</span>
                        </div>
                      </>
                    ) : (
                      <Skeleton style={{ margin: "0 auto", width: "25px" }} />
                    )}
                  </div>
                </>
              )}

              <Button
                className="wallet-btn"
                onClick={handleShow}
              >
                Enter the Maze
              </Button>

              <Modal show={show} onHide={handleClose}>
                <Modal.Body className="modal-bg-main">
                  <div >
                    <Box className="stake-action-area border-bot">
                      <Tabs
                        key={String(zoomed)}
                        centered
                        value={view}
                        textColor="primary"
                        indicatorColor="primary"
                        className="stake-tab-buttons"
                        // onChange={changeView}
                        aria-label="stake tabs"
                      >
                        <Tab className={`${tabActive === 1 ? "active" : ""} green`} label="Stake" {...a11yProps(0)} onClick={() => setTabActive(1)} />
                        <Tab className={`${tabActive === 2 ? "active" : ""} pink`} label="Unstake" {...a11yProps(1)} onClick={() => setTabActive(2)} />
                      </Tabs>
                    </Box>
                    <div className="search-bar mt-3 px-3">
                      <span>Max Available: 0</span>
                      <div className="d-flex align-items-center gap">
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
                    <p>Your Cat has found</p>
                    <Box style={{ width: "fit-content", marginTop: '15px', marginBottom: "15px" }} >
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

                    </Box>
                  </div>
                </Modal.Body>
              </Modal>

              <Modal
                open={trapMazeModal}
                onClose={handleTrapClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ width: smallerScreen || verySmallScreen ? '85%' : "40%", margin: "0 auto", marginTop: smallerScreen || verySmallScreen ? '15%' : '5%' }}
              >
                <Box>
                  <Paper style={{ paddingTop: "2%" }}>
                    <Paper style={{ background: "transparent", width: "85%", margin: "0 auto" }}>
                      <Typography variant="h3" color="textSecondary" style={{ textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%" }}>The Maze</Typography>
                    </Paper>
                    <Tabs
                      key={String(zoomed)}
                      centered
                      value={view}
                      style={{ color: "#3ce8a6" }}
                      indicatorColor="success"
                      className="stake-tab-buttons"
                      onChange={changeView}
                      aria-label="stake tabs"
                    >
                      <Tab label="Stake" {...a11yProps(0)} />
                      <Tab label="Unstake" {...a11yProps(1)} />
                    </Tabs>
                    <Box style={{ display: "flex", justifyContent: "center" }}>
                      <TabPanel value={view} index={0} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && isGameApproved ? (
                          <Box style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <TextField
                              id="filled-number"
                              label={`Max Available: ${trapBalance}`}
                              type="number"
                              value={trapStakeAmount}
                              onChange={(e) => { setTrapStakeAmount(e.target.value) }}
                              style={{ marginBottom: "5%" }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              variant="outlined"
                            />
                            <Button
                              className="stake-button"
                              variant="outlined"
                              color="primary"
                              style={{ marginBottom: "2%", marginRight: "2%" }}
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
                            style={{ marginBottom: "2%", marginRight: "2%" }}
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
                          <Box style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <TextField
                              id="filled-number"
                              label={`Max Available: ${stakedTraps}`}
                              type="number"
                              value={trapUnstakeAmount}
                              onChange={(e) => { setTrapUnstakeAmount(e.target.value) }}
                              style={{ marginBottom: "5%" }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              variant="outlined"
                            />
                            <Button
                              className="stake-button"
                              variant="outlined"
                              color="primary"
                              style={{ marginBottom: "2%", marginRight: "2%" }}
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
                            style={{ marginBottom: "2%", marginRight: "2%" }}
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
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Play;
