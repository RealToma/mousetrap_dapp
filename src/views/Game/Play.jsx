import React, { useEffect, useState } from "react";
import { Paper, Button, Grid, Typography, InputAdornment, OutlinedInput, TextField, Box, Zoom, Container, useMediaQuery, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
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
import { Col, Row, Modal, Tabs, Tab } from "react-bootstrap";


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

  const [getStartModal, setGetStartModal] = useState(false);
  const getStartModalClose = () => setGetStartModal(false);
  const getStartModalShow = () => setGetStartModal(true);

  const [catModal, setCatModal] = useState(false);
  const catModalClose = () => setCatModal(false);
  const catModalShow = () => setCatModal(true);

  const [cardModal, setCardModal] = useState(false);
  const cardModalClose = () => setCardModal(false);
  const cardModalShow = () => setCardModal(true);

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
        <Row className=" justify-content-center mb-5">
          <Col lg={4} md={6} sm={12} className="mt-5">
            <div className="yellow-play text-center">
              <img src={require('./mouse.png').default} alt="" width={150} />
              {!address ? (
                <>
                  <p>Connect your wallet to stake Mice</p>
                  {modalButton}
                </>
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
                  <Button
                    className="stake-wallet-btn mt-5"
                    onClick={getStartModalShow}
                    variant="outlined"
                    color="primary"
                  >
                    Enter the Maze
                  </Button>
                  <Modal show={getStartModal} onHide={getStartModalClose}>
                    <Modal.Body className="mini-modal-1">
                      <button style={{
                        position: "absolute",
                        right: "0",
                        top: "-1px",
                        height: "24px",
                        width: "24px",
                        background: "transparent",
                        border: "none"
                      }} onClick={getStartModalClose}></button>
                      <div className="caution">
                        <h2 className="mb-0">Caution</h2>
                        <p>Entering the Maze is not without risk!</p>
                        <div className="list">
                          <span>Make sure you understand the following:</span>
                          <div className="d-flex mt-3 align-items-start gap">
                            <img src={require('./chees.png').default} alt="" />
                            <p>You have a 5% chance of losing your Mouse to a MouseTrap when unstaking</p>
                          </div>
                          <div className="d-flex mt-1 align-items-start gap">
                            <img src={require('./chees.png').default} alt="" />
                            <p>You have a 45% chance of losing your CHEEZ rewards to Cats when unstaking</p>
                          </div>
                          <div className="d-flex mt-1 align-items-start gap">
                            <img src={require('./chees.png').default} alt="" />
                            <p>Claiming rewards has a 25% extortion fee paid to Cats</p>
                          </div>
                          <div className="d-flex mt-1 align-items-start gap">
                            <img src={require('./chees.png').default} alt="" />
                            <p>Unstaking requires 2 days worth of unclaimed rewards</p>
                          </div>
                          <div className="d-flex mt-1 align-items-start gap">
                            <img src={require('./chees.png').default} alt="" />
                            <p>Staking additional Mice will claim rewards and reset your 2-day staking lockup</p>
                          </div>
                        </div>
                      </div>
                      <div className="mini-tab mt-4">
                        <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
                          <Tab eventKey="home" title="Stake">
                            {isAllowanceDataLoading ? (
                              <Skeleton />
                            ) : address && isGameApproved ? (
                              <div className="search-bar mt-3">
                                <span>{`Max Available: ${mouseBalance}`}</span>
                                <div className="d-flex align-items-center gap">
                                  <div className="search-box d-flex align-items-center justify-content-between w-100">
                                    <input type="text" className="w-100" value={mouseStakeAmount}
                                      onChange={(e) => { setMouseStakeAmount(e.target.value) }} />
                                  </div>
                                  <Button
                                    className="green"
                                    disabled={isPendingTxn(pendingTransactions, "game_stake")}
                                    onClick={() => {
                                      onStake(0, mouseStakeAmount);
                                    }}>{txnButtonText(pendingTransactions, "Entering Maze", "Stake Mice")}</Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                className="green"
                                disabled={isPendingTxn(pendingTransactions, "approve_game")}
                                onClick={onSeekApproval}
                              >
                                {txnButtonText(pendingTransactions, "approve_game", "Approve")}
                              </Button>
                            )}
                          </Tab>

                          <Tab eventKey="profile" title="Unstake">
                            {isAllowanceDataLoading ? (
                              <Skeleton />
                            ) : address ? (
                              <div className="search-bar mt-3">
                                <span>{`Max Available: ${stakedMice}`}</span>
                                <div className="d-flex align-items-center gap">
                                  <div className="search-box d-flex align-items-center justify-content-between w-100">
                                    <input type="text" className="w-100" value={mouseUnstakeAmount}
                                      onChange={(e) => { setMouseUnstakeAmount(e.target.value) }} />

                                  </div>
                                  <Button className="pink text-white"
                                    disabled={isPendingTxn(pendingTransactions, "unstaking")}
                                    onClick={() => {
                                      onUnstake(0, mouseUnstakeAmount);
                                    }} >
                                    {txnButtonText(pendingTransactions, "Leaving Maze", "Unstake Mice")}
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button className="pink text-white"
                                disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                                onClick={onSeekApproval} >
                                {txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}
                              </Button>
                            )}
                          </Tab>
                        </Tabs>
                        {stakedMice != undefined && rewardsMice != undefined ? (
                          <span className="d-flex mini-def mt-3">Your {stakedMice > 1 ? 'Mice have' : 'Mouse has'} found <p className="mb-0 text-green">{parseFloat(ethers.utils.formatUnits(rewardsMice, 9).toString()).toFixed(3)}</p> CHEEZ in the Maze</span>
                        ) : (
                          <Skeleton style={{ margin: "0 auto", width: "25px" }} />
                        )}
                        <Button
                          className="stake-button"
                          disabled={isPendingTxn(pendingTransactions, "game_claim")}
                          onClick={() => {
                            onClaim(0);
                          }}
                        >
                          {txnButtonText(pendingTransactions, "game_claim", "Claim Rewards")}
                        </Button>
                      </div>
                    </Modal.Body>
                  </Modal>
                </>
              )}
            </div>

            <div className="play-timer">
              <GameTimer />
            </div>

          </Col>
          <Col lg={4} md={6} sm={12} className="mt-5">
            <div className="yellow-play text-center">
              <img src={require('./cat.png').default} alt="" width={150} />
              {!address ? (
                <>
                  <p>Connect your wallet to stake Cats</p>
                  {modalButton}
                </>
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
                  <Button
                    className="stake-wallet-btn mt-5"
                    onClick={catModalShow}
                    variant="outlined"
                    color="primary"
                  >
                    Enter the Maze
                  </Button>
                  <Modal show={catModal} onHide={catModalClose}>
                    <Modal.Body className="mini-modal-1">
                      <button style={{
                        position: "absolute",
                        right: "0",
                        top: "-1px",
                        height: "24px",
                        width: "24px",
                        background: "transparent",
                        border: "none"
                      }} onClick={catModalClose}></button>
                      <div className="mini-tab mt-4">
                        <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
                          <Tab eventKey="home" title="Stake">

                            {isAllowanceDataLoading ? (
                              <Skeleton />
                            ) : address && isGameApproved ? (
                              <div className="search-bar mt-3">
                                <span>{`Max Available: ${catBalance}`}</span>
                                <div className="d-flex align-items-center gap">
                                  <div className="search-box d-flex align-items-center justify-content-between w-100">
                                    <input type="text" className="w-100" value={catStakeAmount}
                                      onChange={(e) => { setCatStakeAmount(e.target.value) }} />
                                  </div>
                                  <Button className="green"
                                    disabled={isPendingTxn(pendingTransactions, "game_stake")}
                                    onClick={() => {
                                      onStake(1, catStakeAmount);
                                    }}>
                                    {txnButtonText(pendingTransactions, "Entering Maze", "Stake Cats")}
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button className="green"
                                disabled={isPendingTxn(pendingTransactions, "approve_game")}
                                onClick={onSeekApproval}>
                                {txnButtonText(pendingTransactions, "approve_game", "Approve")}
                              </Button>
                            )}
                          </Tab>
                          <Tab eventKey="profile" title="Unstake">
                            {isAllowanceDataLoading ? (
                              <Skeleton />
                            ) : address ? (
                              <div className="search-bar mt-3">
                                <span>{`Max Available: ${stakedCats}`}</span>
                                <div className="d-flex align-items-center gap">
                                  <div className="search-box d-flex align-items-center justify-content-between w-100">
                                    <input type="text" className="w-100" value={catUnstakeAmount}
                                      onChange={(e) => { setCatUnstakeAmount(e.target.value) }} />

                                  </div>
                                  <Button className="pink text-white"
                                    disabled={isPendingTxn(pendingTransactions, "game_unstake")}
                                    onClick={() => {
                                      onUnstake(1, catUnstakeAmount);
                                    }}>
                                    {txnButtonText(pendingTransactions, "Leaving Maze", "Unstake Cats")}
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                className="pink text-white"
                                disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                                onClick={onSeekApproval}>
                                {txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}
                              </Button>
                            )}
                          </Tab>
                        </Tabs>
                        {catBalance != null || undefined ? (
                          <span className="d-flex mini-def mt-3">Your {catBalance > 1 ? 'Cats have' : 'Cat has'} found <p className="mb-0 text-green">{parseFloat(ethers.utils.formatUnits(rewardsCats, 9).toString()).toFixed(3)}</p> CHEEZ in the Maze</span>
                        ) : (<></>)}

                        <Button
                          className="stake-button"
                          disabled={isPendingTxn(pendingTransactions, "game_claim")}
                          onClick={() => {
                            onClaim(1);
                          }}
                        >
                          {txnButtonText(pendingTransactions, "game_claim", "Claim Rewards")}
                        </Button>
                      </div>
                    </Modal.Body>
                  </Modal>
                </>
              )}

            </div>
          </Col>

          <Col lg={4} md={6} sm={12} className="mt-5">
            <div className="yellow-play text-center">
              <img src={require('./mouse-trap.png').default} alt="" width={150} />

              {!address ? (
                <>
                  <p>Connect your wallet to stake Traps</p>
                  {modalButton}
                </>
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
                  <Button
                    className="stake-wallet-btn mt-5"
                    variant="outlined"
                    color="primary"
                    onClick={cardModalShow}
                  >
                    Enter the Maze
                  </Button>
                  <Modal show={cardModal} onHide={cardModalClose}>
                    <Modal.Body className="mini-modal-1">
                      <button style={{
                        position: "absolute",
                        right: "0",
                        top: "-1px",
                        height: "24px",
                        width: "24px",
                        background: "transparent",
                        border: "none"
                      }} onClick={cardModalClose}></button>
                      <div className="mini-tab mt-4">
                        <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
                          <Tab eventKey="home" title="Stake">

                            {isAllowanceDataLoading ? (
                              <Skeleton />
                            ) : address && isGameApproved ? (
                              <div className="search-bar mt-3">
                                <span>{`Max Available: ${trapBalance}`}</span>
                                <div className="d-flex align-items-center gap">
                                  <div className="search-box d-flex align-items-center justify-content-between w-100">
                                    <input type="text" className="w-100" value={trapStakeAmount}
                                      onChange={(e) => { setTrapStakeAmount(e.target.value) }}
                                      style={{ marginBottom: "5%" }} />

                                  </div>
                                  <Button className="green"
                                    disabled={isPendingTxn(pendingTransactions, "game_stake")}
                                    onClick={() => {
                                      onStake(2, trapStakeAmount);
                                    }}>
                                    {txnButtonText(pendingTransactions, "Entering Maze", "Stake Traps")}
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button className="green"
                                disabled={isPendingTxn(pendingTransactions, "approve_game")}
                                onClick={onSeekApproval}>
                                {txnButtonText(pendingTransactions, "approve_game", "Approve")}
                              </Button>
                            )}
                          </Tab>
                          <Tab eventKey="profile" title="Unstake">

                            {isAllowanceDataLoading ? (
                              <Skeleton />
                            ) : address ? (
                              <div className="search-bar mt-3">
                                <span>{`Max Available: ${stakedTraps}`}</span>
                                <div className="d-flex align-items-center gap">
                                  <div className="search-box d-flex align-items-center justify-content-between w-100">
                                    <input type="text" className="w-100" value={trapUnstakeAmount}
                                      onChange={(e) => { setTrapUnstakeAmount(e.target.value) }} />

                                  </div>
                                  <Button className="pink text-white"
                                    disabled={isPendingTxn(pendingTransactions, "game_unstake")}
                                    onClick={() => {
                                      onUnstake(2, trapUnstakeAmount);
                                    }}>
                                    {txnButtonText(pendingTransactions, "Leaving Maze", "Unstake Traps")}
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button className="pink text-white"
                                disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                                onClick={onSeekApproval}>
                                {txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}
                              </Button>
                            )}
                          </Tab>
                        </Tabs>
                      </div>
                    </Modal.Body>
                  </Modal>
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Play;
