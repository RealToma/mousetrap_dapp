import React, { useEffect, useState } from "react";
import { Paper, Button, Grid, Typography, InputAdornment, OutlinedInput, TextField, Box, Zoom, Container, useMediaQuery, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import { loadAccountDetails } from "../../slices/AccountSlice";
import { useSelector, useDispatch, useAppSelector } from "react-redux";
import { ethers } from "ethers";
import Mouse from "../../assets/images/mouse.png";
import Cat from "../../assets/images/catlogo.png";
import MouseTrap from "../../assets/images/mousetrap.png";
import TabPanel from "../../components/TabPanel";
import { changeApproval, gameStake, gameUnstake, gameClaimRewards } from "../../slices/GameThunk";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { trim } from "../../helpers";
import { Skeleton } from "@material-ui/lab";
import GameTimer from "../../components/GameTimer/GameTimer";
import UnlockTimer from "../../components/GameTimer/UnlockTimer";

import "./Play.css";
import { textAlign } from "@material-ui/system";
import { Col, Row, Modal, Tabs, Tab, Table } from "react-bootstrap";


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

  const [unstakingResult, setUnstakingResult] = useState(false);
  const unstakingResultModalClose = () => setUnstakingResult(false);
  const unstakingResultModalShow = () => setUnstakingResult(true);

  const [unstakingResult2, setUnstakingResult2] = useState(false);
  const unstakingResultModalClose2 = () => setUnstakingResult2(false);
  const unstakingResultModalShow2 = () => setUnstakingResult2(true);

  const [unstaking, setUnstaking] = useState(false);
  const unstakingModalClose = () => setUnstaking(false);
  const unstakingModalShow = () => setUnstaking(true);

  const [unstaking2, setUnstaking2] = useState(false);
  const unstakingModalClose2 = () => setUnstaking2(false);
  const unstakingModalShow2 = () => setUnstaking2(true);

  const [key, setKey] = useState('stake');

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

              <div className="img-container">
                <img src={require('../../assets/images/mouse.png').default} alt="" width={150} />
              </div>
              {!address ? (
                <div className="play-game-connect">
                  <p>Connect your wallet to stake Mice</p>
                  {modalButton}
                </div>
              ) : (
                <>
                  <div className="data-row mt-3">
                    {mouseBalance != undefined || null ? (
                      <>
                        <div className="data-sub dashed-border d-flex justify-content-between">
                          <span className="data-text">Ready for the Maze</span>
                          <span className="data-empty"></span>
                          <span className="data-text">{mouseBalance} {mouseBalance > 1 ? 'Mice' : 'Mouse'}</span>
                        </div>
                      </>) : (<></>)}
                  </div>

                  <div className="data-row">
                    {stakedMice != null || undefined ? (
                      <>
                        <div className="data-sub dashed-border d-flex justify-content-between">
                          <span className="data-text">In the Maze</span>
                          <span className="data-empty"></span>
                          <span className="data-text">{stakedMice} {stakedMice > 1 ? 'Mice' : 'Mouse'}</span>
                        </div>
                      </>) : (
                      <></>
                    )}
                  </div>

                  <div className="data-row">
                    {rewardsMice != undefined && stakedMice != undefined ? (
                      <>
                        <div className="data-sub dashed-border d-flex justify-content-between">
                          <span className="data-text">CHEEZ in the Maze</span>
                          <span className="data-empty"></span>
                          <span className="data-text">{stakedMice > 1 ? 'Mice have' : 'Mouse has'}</span>
                        </div>
                      </>) : (
                      <></>
                    )}
                  </div>

                  <div className="data-row">
                    {miceReward != undefined && stakedMice != undefined ? (
                      <>
                        <div className="data-sub dashed-border d-flex justify-content-between">
                          <span className="data-text">My next reward is</span>
                          <span className="data-empty"></span>
                          <span className="data-text">{myNextReward}🧀 ({miceReward} 🧀/ Mouse)</span>
                        </div>
                      </>
                    ) : (
                      <Skeleton style={{ margin: "0 auto", width: "25px" }} />
                    )}
                  </div>
                  <div className="btn2 d-flex align-items-center gap-2">
                    <Button
                      className="stake-wallet-btn mt-4"
                      onClick={getStartModalShow}
                      variant="outlined"
                      color="primary"
                    >
                      Enter/Exit the Maze
                    </Button>
                    <Button
                      className="stake-button w-100 mt-25"
                      disabled={isPendingTxn(pendingTransactions, "game_claim")}
                      onClick={() => {
                        onClaim(0);
                      }}
                    >
                      {txnButtonText(pendingTransactions, "game_claim", "Claim Rewards")}
                    </Button>
                  </div>
                  <div className="text">
                    {stakedMice != undefined && rewardsMice != undefined ? (
                      <span className="d-flex justify-content-center mini-def mt-3">Your {stakedMice > 1 ? 'Mice have' : 'Mouse has'} found <p className="mb-0 text-green" style={{ color: '#21865B' }}>{parseFloat(ethers.utils.formatUnits(rewardsMice, 9).toString()).toFixed(3)}</p> CHEEZ in the Maze</span>
                    ) : (
                      <Skeleton style={{ margin: "0 auto", width: "25px" }} />
                    )}
                  </div>
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
                          <div className="bg-pink-header mb-3">
                            <h2 className="mb-0">Caution</h2 >
                            <p className="mb-0">Entering the Maze is not without risk!</p>
                          </div>
                          <div className="list">
                            <span>Make sure you understand the following:</span>
                            <div className="d-flex mt-3 align-items-start gap">
                              <img src={require('../../assets/images/chees.png').default} alt="" />
                              <p>You have a 5% chance of losing your Mouse to a MouseTrap when unstaking</p>
                            </div>
                            <div className="d-flex mt-1 align-items-start gap">
                              <img src={require('../../assets/images/chees.png').default} alt="" />
                              <p>You have a 45% chance of losing your CHEEZ rewards to Cats when unstaking</p>
                            </div>
                            <div className="d-flex mt-1 align-items-start gap">
                              <img src={require('../../assets/images/chees.png').default} alt="" />
                              <p>Claiming rewards has a 25% extortion fee paid to Cats</p>
                            </div>
                            <div className="d-flex mt-1 align-items-start gap">
                              <img src={require('../../assets/images/chees.png').default} alt="" />
                              <p>Unstaking requires 2 days worth of unclaimed rewards</p>
                            </div>
                            <div className="d-flex mt-1 align-items-start gap">
                              <img src={require('../../assets/images/chees.png').default} alt="" />
                              <p>Staking additional Mice will claim rewards and reset your 2-day staking lockup</p>
                            </div>
                          </div>
                        </div>

                      {key === "unstake" && <UnlockTimer />}

                      <div className="mini-tab mt-4">
                        <Tabs id="controlled-tab-example"
                          activeKey={key}
                          onSelect={(k) => setKey(k)} className="mb-3">
                          <Tab eventKey="stake" title="Stake">
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

                          <Tab eventKey="unstake" title="Unstake">
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
                                      // getStartModalClose();
                                      // unstakingModalShow();
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
                      </div>
                    </Modal.Body>
                  </Modal>
                  <Modal show={unstaking} onHide={unstakingModalClose}>
                    <Modal.Body className="unstake-modal">
                      <div className="unsstake-result-header px-4">naz
                        <h2>Unstaking Result</h2>
                        <p>You attempted to unstake <span className="text-yellow">46 Mice</span> and <span className="text-yellow">25 CHEEZ</span> from the Maze </p>
                      </div>
                      <Row className="breen-mc">
                        <Col lg={6} md={6} sm={12} className="mt-3">
                          <div className="breen-mpuse">
                            <img src={require('../../assets/images/mouse.png').default} alt="" width={100} />
                            <h4>x41</h4>
                          </div>
                        </Col>
                        <Col lg={6} md={6} sm={12} className="mt-3">
                          <div className="breen-mpuse">
                            <img src={require('../../assets/images/green-cheese.png').default} className="mt-4" alt="" width={70} />
                            <h4 className="mt-2">x0</h4>
                          </div>
                        </Col>
                      </Row>
                      <p className="sum-def mt-3"><span className="text-bg-green">41 Mice</span> and <span className="text-bg-green" className="text-bg-green">0 CHEEZ</span> made it out of the Maze</p>
                      <Row className="pink-mc pb-2">
                        <Col lg={6} md={6} sm={12} className="mt-3">
                          <div className="pink-mpuse d-flex align-items-center justify-content-center gap-2">
                            <img src={require('../../assets/images/mouse.png').default} alt="" width={45} />
                            <h4 className="mb-0">x41</h4>
                          </div>
                        </Col>
                        <Col lg={6} md={6} sm={12} className="mt-3">
                          <div className="pink-mpuse d-flex align-items-center justify-content-center gap-2">
                            <img src={require('../../assets/images/green-cheese.png').default} alt="" width={30} />
                            <h4 className="mt-2">x0</h4>
                          </div>
                        </Col>
                      </Row>
                      <p className="sum-def mt-3"><span className="text-bg-pink">5 Mice</span> were caught in Traps and <span className="text-bg-pink">25 CHEEZ</span> was stolen by Cats</p>
                      <Button className="last-btn w-100" onClick={() => {
                        unstakingModalClose();
                        unstakingResultModalShow2()
                      }}>Got it!</Button>
                    </Modal.Body>
                  </Modal>
                  <Modal show={unstakingResult2} onHide={unstakingResultModalClose2}>
                    <Modal.Body className="last-modal">
                      <div className="last-modal-header px-2">
                        <h2>Unstaking Result</h2>
                        <p>You attempted to unstake 46 Mice & 25.34 CHEEZ. <span className="text-gren-last">40 Mice</span> & <span className="text-gren-last">15.32 CHEEZ</span> made it out safety.</p>
                      </div>
                      <div className="result-box mt-3">
                        <div className="result-box-sub d-flex align-items-center justify-content-between">
                          <div className="result-left ">
                            <div className="result-left-sub d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/mouse.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>Mouse 1 -----------------</span>
                                <img src={require('../../assets/images/check-green.png').default} alt="" />
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/green-cheese.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>0.65 CHEEZ --------------</span>
                                <img src={require('../../assets/images/check-green.png').default} alt="" />
                              </div>
                            </div>
                          </div>
                          <div className="result-right">
                            <img src={require('../../assets/images/flag.png').default} alt="" />
                            <h5>Made it!</h5>
                          </div>
                        </div>
                      </div>
                      <div className="result-box mt-3">
                        <div className="result-box-sub d-flex align-items-center justify-content-between">
                          <div className="result-left ">
                            <div className="result-left-sub d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/mouse.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>Mouse 1 ----------------</span>
                                <img src={require('../../assets/images/check-green.png').default} alt="" />
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/green-cheese.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>0.65 CHEEZ -------------</span>
                                <img src={require('../../assets/images/redclose.png').default} alt="" />
                              </div>
                            </div>
                          </div>
                          <div className="result-right">
                            <img src={require('../../assets/images/cat.png').default} alt="" width={45} />
                            <h6>Robbed by Cats!</h6>
                          </div>
                        </div>
                      </div>
                      <div className="result-box mt-3">
                        <div className="result-box-sub d-flex align-items-center justify-content-between">
                          <div className="result-left ">
                            <div className="result-left-sub d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/mouse.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>Mouse 1 -----------------</span>
                                <img src={require('../../assets/images/check-green.png').default} alt="" />
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/green-cheese.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>0.65 CHEEZ --------------</span>
                                <img src={require('../../assets/images/check-green.png').default} alt="" />
                              </div>
                            </div>
                          </div>
                          <div className="result-right">
                            <img src={require('../../assets/images/flag.png').default} alt="" />
                            <h5>Made it!</h5>
                          </div>
                        </div>
                      </div>
                      <div className="result-box mt-3">
                        <div className="result-box-sub d-flex align-items-center justify-content-between">
                          <div className="result-left ">
                            <div className="result-left-sub d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/mouse.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>Mouse 1 -----------------</span>
                                <img src={require('../../assets/images/check-green.png').default} alt="" />
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/green-cheese.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>0.65 CHEEZ --------------</span>
                                <img src={require('../../assets/images/check-green.png').default} alt="" />
                              </div>
                            </div>
                          </div>
                          <div className="result-right">
                            <img src={require('../../assets/images/flag.png').default} alt="" />
                            <h5>Made it!</h5>
                          </div>
                        </div>
                      </div>
                      <div className="result-box mt-3">
                        <div className="result-box-sub d-flex align-items-center justify-content-between">
                          <div className="result-left ">
                            <div className="result-left-sub d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/mouse.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>Mouse 1 -------------</span>
                                <img src={require('../../assets/images/redclose.png').default} alt="" />
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/green-cheese.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>0.65 CHEEZ ----------</span>
                                <img src={require('../../assets/images/redclose.png').default} alt="" />
                              </div>
                            </div>
                          </div>
                          <div className="result-right">
                            <img src={require('../../assets/images/mouse-trap.png').default} alt="" width={45} />
                            <h5>Trapped!<br />(Owner: 0x1234)</h5>
                          </div>
                        </div>
                      </div>
                      <div className="pagination1 mt-3 px-3">
                        <div className="pagination-btns d-flex align-items-center">
                          <Button><img src={require('../../assets/images/left-arrow.png').default} alt="" /></Button>
                          <Button className="pages active">1</Button>
                          <Button className="pages">2</Button>
                          <Button className="pages">3</Button>
                          <Button>...</Button>
                          <Button className="pages">5</Button>
                          <Button><img src={require('../../assets/images/right-arrow.png').default} alt="" /></Button>
                        </div>
                      </div>
                      <Button className="last-btn w-100">Got it!</Button>
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
              <div className="img-container">
                <img src={require('../../assets/images/cat.png').default} alt="" width={150} />
              </div>
              
              {!address ? (
                <div className="play-game-connect">
                  <p>Connect your wallet to stake Cats</p>
                  {modalButton}
                </div>
              ) : (
                <>
                  <div className="data-row mt-3">
                    {catBalance ? (
                      <>
                        <div className="data-sub dashed-border d-flex justify-content-between">
                          <span className="data-text">Ready for the Maze</span>
                          <span className="data-empty"></span>
                          <span className="data-text">{catBalance} {catBalance > 1 ? 'Cats' : 'Cat'}</span>
                        </div>
                      </>
                    ) : (<></>)}
                  </div>

                  <div className="data-row">
                    {stakedCats != undefined ? (
                      <>
                        <div className="data-sub dashed-border d-flex justify-content-between">
                          <span className="data-text">In the Maze</span>
                          <span className="data-empty"></span>
                          <span className="data-text">{stakedCats} {stakedCats > 1 ? 'Cats' : 'Cat'}</span>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>

                  <div className="data-row">
                    {rewardsCats != undefined && stakedCats != undefined ? (
                      <>
                        <div className="data-sub dashed-border d-flex justify-content-between">
                          <span className="data-text">Claimable CHEEZ</span>
                          <span className="data-empty"></span>
                          <span className="data-text">{parseFloat(ethers.utils.formatUnits(rewardsCats, 9).toString()).toFixed(3)}</span>
                        </div>
                      </>
                    ) : (
                      <Skeleton style={{ margin: "0 auto", width: "25px" }} />
                    )}
                  </div>

                  <div className="data-row">
                    {nextCatPool != undefined ? (
                      <>
                        <div className="data-sub dashed-border d-flex justify-content-between">
                          <span className="data-text">The Cat pool has </span>
                          <span className="data-empty"></span>
                          <span className="data-text">{nextCatPool}🧀</span>
                        </div>
                      </>
                    ) : (
                      <Skeleton style={{ margin: "0 auto", width: "25px" }} />
                    )}
                  </div>
                  <div className="btn2 d-flex align-items-center gap-2">
                    <Button
                      className="stake-wallet-btn mt-4"
                      onClick={catModalShow}
                      variant="outlined"
                      color="primary"
                    >
                      Enter/Exit the Maze
                    </Button>
                    <Button
                      className="stake-button w-100 mt-25"
                      disabled={isPendingTxn(pendingTransactions, "game_claim")}
                      onClick={() => {
                        onClaim(1);

                      }}
                    >
                      {txnButtonText(pendingTransactions, "game_claim", "Claim Rewards")}
                    </Button>
                  </div>
                  <div className="text">
                    {catBalance != null || undefined ? (
                      <span className="d-flex justify-content-center mini-def mt-3">Your {catBalance > 1 ? 'Cats have' : 'Cat has'} found <p className="mb-0 text-green" style={{ color: '#21865B' }}>{parseFloat(ethers.utils.formatUnits(rewardsCats, 9).toString()).toFixed(3)}</p> CHEEZ in the Maze</span>
                    ) : (<></>)}
                  </div>
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
                                <div className="d-flex align-items-center gap" on>
                                  <div className="search-box d-flex align-items-center justify-content-between w-100">
                                    <input type="text" className="w-100" value={catStakeAmount}
                                      onChange={(e) => { setCatStakeAmount(e.target.value) }} />
                                  </div>
                                  <Button className="green"
                                    disabled={isPendingTxn(pendingTransactions, "game_stake")}
                                    onClick={() => {
                                      onStake(1, catStakeAmount);
                                      setIsTimer(false)
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
                                      catModalClose();
                                      unstakingResultModalShow();
                                      setIsTimer(true)
                                    }}>
                                    {txnButtonText(pendingTransactions, "Leaving Maze", "Unstake Cats")}
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                className="pink text-white"
                                disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                                onClick={() => { onSeekApproval; }}>
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

          <Col lg={4} md={6} sm={12} className="mt-5" >
            <div className="yellow-play text-center">
              <div className="img-container">
                <img src={require('../../assets/images/mouse-trap.png').default} alt="" width={150} />
              </div>
              {!address ? (
                <div className="play-game-connect">
                  <p>Connect your wallet to stake Traps</p>
                  {modalButton}
                </div>
              ) : (
                <>
                  <div className="data-row mt-3">
                    {trapBalance != null || undefined ? (
                      <>
                        <div className="data-sub dashed-border d-flex justify-content-between">
                          <span className="data-text">Ready for the Maze</span>
                          <span className="data-empty"></span>
                          <span className="data-text">{trapBalance} {trapBalance > 1 ? 'Traps' : 'Trap'}</span>
                        </div>
                      </>
                    ) : (<></>)}
                  </div>

                  <div className="data-row">
                    {stakedTraps != undefined ? (
                      <>
                        <div className="data-sub dashed-border d-flex justify-content-between">
                          <span className="data-text">In the Maze</span>
                          <span className="data-empty"></span>
                          <span className="data-text">{stakedTraps} {stakedTraps > 1 ? 'Traps' : 'Trap'}</span>
                        </div>
                      </>
                    ) : (
                      <Skeleton style={{ margin: "0 auto", width: "25px" }} />
                    )}
                  </div>
                  <Button
                    className="stake-wallet-btn  mt-5"
                    variant="outlined"
                    color="primary"
                    onClick={cardModalShow}
                  >
                    Enter the Maze
                  </Button>
                  {/* <Modal show={cardModal} onHide={cardModalClose}>
                    <Modal.Body className="mini-modal-1">
                      <div className="white-header">
                        <span>You will be able to unstake in  </span>
                        <h1 className="mb-0">34:21:05</h1>
                      </div>
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
                                      cardModalClose();
                                      unstakingModalShow();
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
                  <Modal show={unstaking} onHide={unstakingModalClose}>
                    <Modal.Body className="unstake-modal">
                      <div className="unsstake-result-header px-4">
                        <h2>Unstaking Result</h2>
                        <p>You attempted to unstake <span className="text-yellow">46 Mice</span> and <span className="text-yellow">25 CHEEZ</span> from the Maze </p>
                      </div>
                      <Row className="breen-mc">
                        <Col lg={6} md={6} sm={12} className="mt-3">
                          <div className="breen-mpuse">
                            <img src={require('../../assets/images/mouse.png').default} alt="" width={100} />
                            <h4>x41</h4>
                          </div>
                        </Col>
                        <Col lg={6} md={6} sm={12} className="mt-3">
                          <div className="breen-mpuse">
                            <img src={require('../../assets/images/green-cheese.png').default} className="mt-4" alt="" width={70} />
                            <h4 className="mt-2">x0</h4>
                          </div>
                        </Col>
                      </Row>
                      <p className="sum-def mt-3"><span className="text-bg-green">41 Mice</span> and <span className="text-bg-green" className="text-bg-green">0 CHEEZ</span> made it out of the Maze</p>
                      <Row className="pink-mc pb-2">
                        <Col lg={6} md={6} sm={12} className="mt-3">
                          <div className="pink-mpuse d-flex align-items-center justify-content-center gap-2">
                            <img src={require('../../assets/images/mouse.png').default} alt="" width={45} />
                            <h4 className="mb-0">x41</h4>
                          </div>
                        </Col>
                        <Col lg={6} md={6} sm={12} className="mt-3">
                          <div className="pink-mpuse d-flex align-items-center justify-content-center gap-2">
                            <img src={require('../../assets/images/green-cheese.png').default} alt="" width={30} />
                            <h4 className="mt-2">x0</h4>
                          </div>
                        </Col>
                      </Row>
                      <p className="sum-def mt-3"><span className="text-bg-pink">5 Mice</span> were caught in Traps and <span className="text-bg-pink">25 CHEEZ</span> was stolen by Cats</p>
                      <Button className="last-btn w-100" onClick={() => {
                        unstakingModalClose();
                        unstakingModalShow2()
                      }}>Got it!</Button>
                    </Modal.Body>
                  </Modal>
                  <Modal show={unstaking2} onHide={unstakingModalClose2}>
                    <Modal.Body className="last-modal">
                      <div className="last-modal-header px-2">
                        <h2>Unstaking Result</h2>
                        <p>You attempted to unstake 46 Mice & 25.34 CHEEZ. <span className="text-gren-last">40 Mice</span> & <span className="text-gren-last">15.32 CHEEZ</span> made it out safety.</p>
                      </div>
                      <div className="result-box mt-3">
                        <div className="result-box-sub d-flex align-items-center justify-content-between">
                          <div className="result-left ">
                            <div className="result-left-sub d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/mouse.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>Mouse 1 -----------------</span>
                                <img src={require('../../assets/images/check-green.png').default} alt="" />
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/green-cheese.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>0.65 CHEEZ --------------</span>
                                <img src={require('../../assets/images/check-green.png').default} alt="" />
                              </div>
                            </div>
                          </div>
                          <div className="result-right">
                            <img src={require('../../assets/images/flag.png').default} alt="" />
                            <h5>Made it!</h5>
                          </div>
                        </div>
                      </div>
                      <div className="result-box mt-3">
                        <div className="result-box-sub d-flex align-items-center justify-content-between">
                          <div className="result-left ">
                            <div className="result-left-sub d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/mouse.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>Mouse 1 ----------------</span>
                                <img src={require('../../assets/images/check-green.png').default} alt="" />
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/green-cheese.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>0.65 CHEEZ -------------</span>
                                <img src={require('../../assets/images/redclose.png').default} alt="" />
                              </div>
                            </div>
                          </div>
                          <div className="result-right">
                            <img src={require('../../assets/images/cat.png').default} alt="" width={45} />
                            <h6>Robbed by Cats!</h6>
                          </div>
                        </div>
                      </div>
                      <div className="result-box mt-3">
                        <div className="result-box-sub d-flex align-items-center justify-content-between">
                          <div className="result-left ">
                            <div className="result-left-sub d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/mouse.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>Mouse 1 -----------------</span>
                                <img src={require('../../assets/images/check-green.png').default} alt="" />
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/green-cheese.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>0.65 CHEEZ --------------</span>
                                <img src={require('../../assets/images/check-green.png').default} alt="" />
                              </div>
                            </div>
                          </div>
                          <div className="result-right">
                            <img src={require('../../assets/images/flag.png').default} alt="" />
                            <h5>Made it!</h5>
                          </div>
                        </div>
                      </div>
                      <div className="result-box mt-3">
                        <div className="result-box-sub d-flex align-items-center justify-content-between">
                          <div className="result-left ">
                            <div className="result-left-sub d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/mouse.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>Mouse 1 -----------------</span>
                                <img src={require('../../assets/images/check-green.png').default} alt="" />
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/green-cheese.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>0.65 CHEEZ --------------</span>
                                <img src={require('../../assets/images/check-green.png').default} alt="" />
                              </div>
                            </div>
                          </div>
                          <div className="result-right">
                            <img src={require('../../assets/images/flag.png').default} alt="" />
                            <h5>Made it!</h5>
                          </div>
                        </div>
                      </div>
                      <div className="result-box mt-3">
                        <div className="result-box-sub d-flex align-items-center justify-content-between">
                          <div className="result-left ">
                            <div className="result-left-sub d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/mouse.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>Mouse 1 -------------</span>
                                <img src={require('../../assets/images/redclose.png').default} alt="" />
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <img src={require('../../assets/images/green-cheese.png').default} alt="" width={40} />
                              <div className="d-flex align-items-center">
                                <span>0.65 CHEEZ ----------</span>
                                <img src={require('../../assets/images/redclose.png').default} alt="" />
                              </div>
                            </div>
                          </div>
                          <div className="result-right">
                            <img src={require('../../assets/images/mouse-trap.png').default} alt="" width={45} />
                            <h5>Trapped!<br />(Owner: 0x1234)</h5>
                          </div>
                        </div>
                      </div>
                      <div className="pagination1 mt-3 px-3">
                        <div className="pagination-btns d-flex align-items-center">
                          <Button><img src={require('../../assets/images/left-arrow.png').default} alt="" /></Button>
                          <Button className="pages active">1</Button>
                          <Button className="pages">2</Button>
                          <Button className="pages">3</Button>
                          <Button>...</Button>
                          <Button className="pages">5</Button>
                          <Button><img src={require('../../assets/images/right-arrow.png').default} alt="" /></Button>
                        </div>
                      </div>
                      <Button className="last-btn w-100">Got it!</Button>
                    </Modal.Body>
                  </Modal> */}
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
      <div className="play-table-container mt-5">
        <h1>Kill feed</h1>
        <div className="play-table">
          <Table responsive>
            <thead>
              <tr>
                <th></th>
                <th>Trap owner</th>
                <th>Mouse owner</th>
                <th>CHEEZ Stolen</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><img src={require('../../assets/images/mouse.png').default} alt="" width={70} /></td>
                <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                <td>
                  <div>
                    <span>0.345</span>
                    <img src={require('../../assets/images/cheese-mini.png').default} alt="" />
                  </div>
                </td>
                <td>1 day ago</td>
              </tr>
              <tr>
                <td><img src={require('../../assets/images/mouse.png').default} alt="" width={70} /></td>
                <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                <td>
                  <div>
                    <span>0.345</span>
                    <img src={require('../../assets/images/cheese-mini.png').default} alt="" />
                  </div>
                </td>
                <td>1 day ago</td>
              </tr>
              <tr>
                <td><img src={require('../../assets/images/mouse.png').default} alt="" width={70} /></td>
                <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                <td>
                  <div>
                    <span>0.345</span>
                    <img src={require('../../assets/images/cheese-mini.png').default} alt="" />
                  </div>
                </td>
                <td>1 day ago</td>
              </tr>
              <tr>
                <td><img src={require('../../assets/images/mouse.png').default} alt="" width={70} /></td>
                <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                <td>
                  <div>
                    <span>0.345</span>
                    <img src={require('../../assets/images/cheese-mini.png').default} alt="" />
                  </div>
                </td>
                <td>1 day ago</td>
              </tr>
              <tr>
                <td><img src={require('../../assets/images/mouse.png').default} alt="" width={70} /></td>
                <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                <td>
                  <div>
                    <span>0.345</span>
                    <img src={require('../../assets/images/cheese-mini.png').default} alt="" />
                  </div>
                </td>
                <td>1 day ago</td>
              </tr>
              <tr>
                <td><img src={require('../../assets/images/mouse.png').default} alt="" width={70} /></td>
                <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                <td>
                  <div>
                    <span>0.345</span>
                    <img src={require('../../assets/images/cheese-mini.png').default} alt="" />
                  </div>
                </td>
                <td>1 day ago</td>
              </tr>
              <tr>
                <td><img src={require('../../assets/images/mouse.png').default} alt="" width={70} /></td>
                <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                <td>
                  <div>
                    <span>0.345</span>
                    <img src={require('../../assets/images/cheese-mini.png').default} alt="" />
                  </div>
                </td>
                <td>1 day ago</td>
              </tr>
              <tr>
                <td><img src={require('../../assets/images/mouse.png').default} alt="" width={70} /></td>
                <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                <td>
                  <div>
                    <span>0.345</span>
                    <img src={require('../../assets/images/cheese-mini.png').default} alt="" />
                  </div>
                </td>
                <td>1 day ago</td>
              </tr>
            </tbody>
          </Table>
          <div className='pagination  b-0 px-2'>
            <span>Showing 1 to 10 out of 894 stakers</span>
            <div className="pagination-btns ms-auto d-flex align-items-center">
              <Button><img src={require('../../assets/images/left-arrow.png').default} alt="" /></Button>
              <Button className="pages active">1</Button>
              <Button className="pages">2</Button>
              <Button className="pages">3</Button>
              <Button>...</Button>
              <Button className="pages">5</Button>
              <Button><img src={require('../../assets/images/right-arrow.png').default} alt="" /></Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Play;
