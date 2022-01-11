import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { addresses } from "../../constants";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import {
  Box,
  Container,
  Paper,
  useMediaQuery,
  Modal,
  FormControl,
  TextField,
  Grid,
  Typography,
} from "@material-ui/core";

import { Skeleton } from "@material-ui/lab";

import { trim } from "../../helpers";
import { transferNFT } from "src/slices/TransferThunk";
import { transferPass } from "src/slices/TransferPassThunk";
import { changeApproval, createListing } from "../../slices/SellSlice";
import { changePassApproval, createPassListing } from "../../slices/SellPassThunk";
import { getBalances, loadAccountDetails } from "../../slices/AccountSlice";
import { getMyListings } from "../../slices/MyListing";
import { deleteListing } from "../../slices/DeleteSlice";
import "./spawns.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";

import Mouse from "./mouse.png";
import Cat from "./catlogo.png";
import MouseTrap from "./mousetrap.png";
import Plus from "./plus.png";
import CloseIcon from "./close.png";
import { eachHourOfInterval } from "date-fns/esm";
import CheezPassGif from "./cheezpass.gif";
import CheezPass from "../CheezPass/CheezPass";
import { Col, Row, Button } from "react-bootstrap";


function Spawns() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [listingModal, setListingModal] = useState(false);
  const [mouseSelect, setMouseSelect] = useState(false);
  const [catSelect, setCatSelect] = useState(false);
  const [trapSelect, setTrapSelect] = useState(false);
  const [passSelect, setPassSelect] = useState(false);
  const [amount, setAmount] = useState(null);
  const [listPrice, setListPrice] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(false);
  const [passApprovalStatus, setPassApprovalStatus] = useState(false);
  const [spawnId, setSpawnId] = useState(null);
  const [extraId, setExtraId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [myListings, setMyListings] = useState([]);
  const accountDetails = useSelector(state => state.account);
  const [offerID, setOfferID] = useState(null);
  const [transferModal, setTransferModal] = useState(false);
  const [transferID, setTransferID] = useState(null);
  const [mouseTrapTransfer, setMouseTrapTransfer] = useState(false);
  const [catTransfer, setCatTransfer] = useState(false);
  const [mouseTransfer, setMouseTransfer] = useState(false);
  const [passTransfer, setPassTransfer] = useState(false);
  const [transferAmount, setTransferAmount] = useState(null);
  const [toAddress, setToAddress] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [id, setId] = useState(null);

  const handleConfirmOpen = () => setConfirmModal(true);
  const handleConfirmClose = () => setConfirmModal(false);

  useEffect(() => {
    dispatch(loadAccountDetails({ networkID: chainID, address, provider: provider }))
    if (approvalStatus === false) {
      if (accountDetails.minting) {
        setApprovalStatus(accountDetails.minting && accountDetails.minting.marketplaceNFTAllowance)
      }
    }
    if (passApprovalStatus === false) {
      setPassApprovalStatus(accountDetails.minting && accountDetails.minting.marketplacePassAllowance)
    }
  }, [loadAccountDetails, accountDetails.minting, approvalStatus, passApprovalStatus])

  useEffect(() => {
    const admin = address
    dispatch(getMyListings({ admin }))
  }, [dispatch, address])
  const myListingsData = useSelector(state => state.myListing);

  const onCancelList = () => {
    setSpawnId(null),
      setMouseSelect(null),
      setCatSelect(null),
      setTrapSelect(null),
      setPassSelect(null),
      setListingModal(false)
  }


  useEffect(() => {
    if (mouseSelect) {
      setSpawnId(0)
    } else if (catSelect) {
      setSpawnId(1)
    } else if (trapSelect) {
      setSpawnId(2)
    } else if (passSelect) {
      setSpawnId(0)
    }
  }, [mouseSelect, catSelect, trapSelect, passSelect])

  useEffect(() => {
    if (mouseTransfer) {
      setId(0)
    } else if (catTransfer) {
      setId(1)
    } else if (mouseTrapTransfer) {
      setId(2)
    }
  }, [mouseTransfer, catTransfer, mouseTrapTransfer])

  useEffect(() => {
    let arr = []
    Object.keys(myListingsData).forEach((key) => {
      arr.push(myListingsData[key])
    })
    setMyListings(arr)
  }, [myListingsData, address])

  const ohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const mouseBalance = useSelector(state => {
    return state.account.balances && state.account.balances.mouse;
  });
  const catBalance = useSelector(state => {
    return state.account.balances && state.account.balances.cat;
  });
  const passBalance = useSelector(state => {
    return state.account.pass && state.account.pass.cheezPassBalance;
  });
  const trapBalance = useSelector(state => {
    return state.account.balances && state.account.balances.trap;
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

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const timeStaked = useSelector(state => {
    return state.account.game && state.account.game.getTimeStaked
  })

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, provider, networkID: chainID }));
  };

  const onSeekPassApproval = async token => {
    await dispatch(changePassApproval({ address, provider, networkID: chainID }));
  };

  const onList = async () => {
    await dispatch(createListing({ provider, amount, address, chainID, spawnId, listPrice }));
  };

  const onPassList = async () => {
    await dispatch(createPassListing({ provider, amount, address, chainID, spawnId, listPrice }));
  };

  const onDelete = async (offerID) => {
    await dispatch(deleteListing({ provider, offerID }));
  };

  const toggleListingModal = () => {
    setListingModal(!listingModal)
  }

  let modalButton = [];

  modalButton.push(
    <Button variant="outlined" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const trimmedBalance = Number(
    [sohmBalance, fsohmBalance, wsohmBalance]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );

  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");

  let history = useHistory();

  return (
    <>
      <div className="main-nfts px-3">
        <Row className="justify-content-center">
          <Col lg={3} md={6} sm={12}>
            <div className="nft-box">
              <img src={require('./mouse.png').default} alt="" width={150} />
              <h3>Mouse</h3>
              <p>x0</p>
            </div>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <div className="nft-box">
              <img src={require('./cat.png').default} alt="" width={150} />
              <h3>Cat</h3>
              <p>x0</p>
            </div>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <div className="nft-box">
              <img src={require('./mouse-trap.png').default} alt="" width={150} />
              <h3>Trap</h3>
              <p>x0</p>
            </div>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <div className="nft-box">
              <img src={require('./cheezpass.gif').default} alt="" width={150} />
              <h3>CHEEZ Pass</h3>
              <p>x0</p>
            </div>
          </Col>
        </Row>
        <div className="d-flex justify-content-center mt-5">
          <Button className="transfer">Transfer NFTs</Button>
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
      </div>
    </>
    // <div id="stake-view">
    // <Container
    //     style={{
    //       paddingLeft: smallerScreen || verySmallScreen ? "0" : "3.3rem",
    //       paddingRight: smallerScreen || verySmallScreen ? "0" : "3.3rem",
    //       overflow: "scroll"
    //     }}
    // >
    //     <Paper style={{marginTop: "1%"}}>
    //     <Typography variant="h2" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>Your NFTs</Typography>
    //     </Paper>
    //     <Box style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
    //       <Box style={{paddingRight: ".75%", paddingLeft: ".75%"}}>
    //         <div style={{display: "flex", justifyContent: "center"}}>
    //           <img src={Mouse} alt="mouse trap mouse pixelated" style={{height: "60px", height: "60px"}} />
    //         </div>
    //         {mouseBalance ? (
    //           <Typography variant="h5" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%", color: "#3ce8a6"}}>x{mouseBalance}</Typography>
    //         ) : (
    //           <Skeleton style={{margin: "0 auto", marginTop: "5%", width: "25px"}} />
    //         )}
    //       </Box>
    //       <Box style={{paddingRight: ".75%", paddingLeft: ".75%"}}>
    //         <div style={{display: "flex", justifyContent: "center"}}>
    //           <img src={Cat} alt="mouse trap cat pixelated" style={{height: "60px", height: "60px"}} />
    //         </div>
    //         {catBalance ? (
    //           <Typography variant="h5" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%", color: "#3ce8a6"}}>x{catBalance}</Typography>
    //         ) : (
    //           <Skeleton style={{margin: "0 auto", marginTop: "5%", width: "25px"}} />
    //         )}          
    //         </Box>
    //       <Box style={{paddingRight: ".75%", paddingLeft: ".75%"}}>
    //         <div style={{display: "flex", justifyContent: "center", marginRight: "3%"}}>
    //           <img src={MouseTrap} alt="mouse trap mousetrap pixelated" style={{height: "60px", height: "60px"}} />
    //         </div>
    //         {trapBalance ? (
    //           <Typography variant="h5" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%", color: "#3ce8a6"}}>x{trapBalance}</Typography>
    //         ) : (
    //           <Skeleton style={{margin: "0 auto", marginTop: "5%", width: "25px"}} />
    //         )}
    //       </Box>
    //       <Box style={{paddingRight: ".75%", paddingLeft: ".75%"}}>
    //         <div style={{display: "flex", justifyContent: "center"}}>
    //           <img src={CheezPassGif} alt="cheez pass gif" style={{height: "60px", height: "60px"}} />
    //         </div>
    //         {passBalance ? (
    //           <Typography variant="h5" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%", color: "#3ce8a6"}}>x{passBalance}</Typography>
    //         ) : (
    //           <Skeleton style={{margin: "0 auto", marginTop: "5%", width: "25px"}} />
    //         )}          
    //         </Box>
    //     </Box>
    //     <Box style={{display: "flex", justifyContent: "center", width: "100%"}}>
    //         <Button
    //           variant="outlined"
    //           color="primary"
    //           style={{ marginTop: "3%", width: "33%"}}
    //           onClick={() => {setTransferModal(true)}}
    //           >
    //           Transfer NFTs
    //         </Button>
    //     </Box>
    //     {transferModal ? (
    //       <Box>
    //         {transferID === null ? (
    //                 <Box>
    //                   <Typography variant="h6" color="textPrimary" style={{textAlign: "center", margin: "0 auto", paddingTop: "1%", paddingBottom: "1%"}}>Which One?</Typography>
    //                   <Grid container style={{display: "flex", flexFlow: "row-nowrap", justifyContent: "center", marginLeft: verySmallScreen ? "27%" : smallerScreen ? "14%" : "7%"}}>
    //                   <Grid item style={{width: "250px", margin: "0 auto", marginBottom: verySmallScreen ? "5%" : smallerScreen ? "3%" : "0"}}>
    //                   <Paper onClick={() => {
    //                     setMouseTransfer(true)
    //                     setMouseTrapTransfer(false)
    //                     setPassTransfer(false)
    //                     setCatTransfer(false)
    //                     }}  style={{display: "flex", flexDirection: "row", justifyContent: "center", width: "40%", background: "transparent", border: `1px solid ${mouseTransfer ? "#ebc50c" : "#3ce8a6"}`}}>
    //                     <div style={{display: "flex", justifyContent: "center"}}>
    //                       <img src={Mouse} alt="mouse trap mouse pixelated" style={{height: "60px", height: "60px"}} />
    //                     </div>
    //                   </Paper>
    //                   </Grid>
    //                   <Grid item style={{width: "250px", margin: "0 auto", marginBottom: verySmallScreen ? "5%" : smallerScreen ? "3%" : "0"}}>
    //                   <Paper onClick={() => {
    //                     setCatTransfer(true)
    //                     setPassTransfer(false)
    //                     setMouseTrapTransfer(false)
    //                     setMouseTransfer(false)
    //                     }} style={{display: "flex", flexDirection: "row", justifyContent: "center", width: "40%", background: "transparent", border: `1px solid ${catTransfer ? "#ebc50c" : "#3ce8a6"}`}}>
    //                     <div style={{display: "flex", justifyContent: "center"}}>
    //                       <img src={Cat} alt="mouse trap cat pixelated" style={{height: "60px", height: "60px"}} />
    //                     </div>
    //                   </Paper>
    //                   </Grid>
    //                   <Grid item style={{width: "250px", margin: "0 auto", marginBottom: verySmallScreen ? "5%" : smallerScreen ? "3%" : "0"}}>
    //                   <Paper onClick={() => {
    //                     setMouseTrapTransfer(true)
    //                     setPassTransfer(false)
    //                     setMouseTransfer(false)
    //                     setCatTransfer(false)
    //                     }} style={{display: "flex", flexDirection: "row", justifyContent: "center", width: "40%", background: "transparent", border: `1px solid ${mouseTrapTransfer ? "#ebc50c" : "#3ce8a6"}`}}>
    //                     <div style={{display: "flex", justifyContent: "center"}}>
    //                       <img src={MouseTrap} alt="mouse trap mousetrap pixelated" style={{height: "60px", height: "60px"}} />
    //                     </div>
    //                   </Paper>
    //                   </Grid>
    //                   <Grid item style={{width: "250px", margin: "0 auto", marginBottom: verySmallScreen ? "5%" : smallerScreen ? "3%" : "0"}}>
    //                   <Paper onClick={() => {
    //                     setPassTransfer(true)
    //                     setCatTransfer(false)
    //                     setMouseTrapTransfer(false)
    //                     setMouseTransfer(false)
    //                     }} style={{display: "flex", flexDirection: "row", justifyContent: "center", width: "40%", background: "transparent", border: `1px solid ${passTransfer ? "#ebc50c" : "#3ce8a6"}`}}>
    //                     <div style={{display: "flex", justifyContent: "center"}}>
    //                       <img src={CheezPassGif} alt="cheez pass rotating" style={{height: "60px", height: "60px"}} />
    //                     </div>
    //                   </Paper>
    //                   </Grid>
    //                 </Grid>
    //                 {mouseTransfer || catTransfer || mouseTrapTransfer || passTransfer ? (
    //                   <Box style={{display: "flex", justifyContent: "center", marginTop: "3%", flexDirection: "column"}}>
    //                   <TextField
    //                     id="filled-number"
    //                     label={`Amount of ${passTransfer === true ? 'Passes' : mouseTransfer === true ? 'Mice' : catTransfer === true ? 'Cats' : mouseTrapTransfer === true ? 'Traps' : ""} to Transfer`}
    //                     type="number"
    //                     value={transferAmount}
    //                     style={{width: verySmallScreen ? "75%" : smallerScreen ? "60%" : "20%", margin: "0 auto", marginBottom: "3%"}}
    //                     onChange={(e) => {setTransferAmount(e.target.value)}}
    //                     inputProps={{ style: { textAlign: "center" } }}
    //                     InputLabelProps={{
    //                       shrink: true,
    //                     }}
    //                     variant="outlined"
    //                   />
    //                   <TextField
    //                     id="filled-number"
    //                     label="0x Formatted Address"
    //                     type="text"
    //                     value={toAddress}
    //                     style={{margin: "0 auto", width: "60%"}}
    //                     onChange={(e) => {setToAddress(e.target.value)}}
    //                     inputProps={{ style: { textAlign: "center" }, maxLength: 42, spellCheck: 'false' }}
    //                     InputLabelProps={{
    //                       shrink: true,
    //                     }}
    //                     variant="outlined"
    //                   />
    //                   {toAddress != null ? (
    //                     <Box>
    //                       {ethers.utils.isAddress(toAddress) === true ? (
    //                           <Typography variant="body1" color="textSecondary" style={{textAlign: "center", marginTop: "1.5%", color: "#3ce8a6"}}>0x Address Validated!</Typography>
    //                       ) : (
    //                         <Typography variant="body1" color="textSecondary" style={{textAlign: "center", marginTop: "1.5%", color: "#f24153"}}>Not a valid 0x Address!</Typography>
    //                       )}
    //                     </Box>
    //                   ) : (
    //                     <></>
    //                   )}
    //                   </Box>
    //                 ) : (
    //                   <></>
    //                 )}
    //                 </Box>
    //         ) : (
    //           <></>
    //         )}
    //       </Box>
    //     ) : (
    //       <></>
    //     )}
    //     {toAddress !== null && transferAmount !== null && ethers.utils.isAddress(toAddress) === true ? (
    //       <Box style={{display: "flex", justifyContent: "center"}}>
    //         <Button
    //           variant="outlined"
    //           color="primary"
    //           style={{marginBottom: "3%", marginTop: "3%", width: "20%"}}
    //           onClick={handleConfirmOpen}
    //         >
    //           Confirm
    //         </Button>
    //         <Modal
    //           open={confirmModal}
    //           onClose={handleConfirmClose}
    //           aria-labelledby="modal-modal-title"
    //           aria-describedby="modal-modal-description"
    //         >
    //           <Box style={{ background: "#140606", width: "50%", margin: "0 auto", marginTop: "10%", marginLeft: "35%", borderRadius: "10px"}}>
    //             <Box>
    //               <Typography variant="h2" color="textSecondary" style={{textAlign: "center", paddingTop: "1%", marginBottom: "2%", color: "#ebc50c"}}>Caution!</Typography>
    //               <Typography variant="h5" color="textSecondary" style={{textAlign: "center", marginTop: "1%", paddingBottom: "5%", color: "#FFFFFF"}}>This is on-chain, and cannot be reversed!</Typography>
    //             </Box>
    //             <Box>
    //             <Typography variant="h5" color="textSecondary" style={{textAlign: "center", marginTop: "1%", color: "#FFFFFF"}}>You are sending <span><Typography variant="h2" color="textSecondary" style={{textAlign: "center", paddingTop: "1%", color: "#ebc50c"}}>{transferAmount}</Typography></span></Typography>
    //             <Typography variant="h5" color="textSecondary" style={{textAlign: "center", marginTop: "1%", paddingBottom: "5%", color: "#FFFFFF"}}><span><Typography variant="h2" color="textSecondary" style={{textAlign: "center", color: "#ebc50c"}}>{transferAmount == 1 && mouseTransfer ? 'Mouse' : transferAmount > 1 && mouseTransfer ? 'Mice' : transferAmount == 1 && catTransfer ? 'Cat' : transferAmount > 1 && catTransfer ? 'Cats' : transferAmount == 1 && mouseTrapTransfer ? 'Trap' : transferAmount > 1 && mouseTrapTransfer ? 'Traps' : transferAmount == 1 && passTransfer ? 'Pass' : transferAmount > 1 && passTransfer ? 'Passes' : ''}</Typography></span></Typography>
    //             </Box>
    //             <Box>
    //             <Typography variant="h5" color="textSecondary" style={{textAlign: "center", marginTop: "1%", color: "#FFFFFF"}}>To</Typography>
    //             <Typography variant="h4" color="textSecondary" style={{textAlign: "center", paddingBottom: "5%", color: "#ebc50c"}}>{toAddress}</Typography>
    //             </Box>
    //             <Box style={{display: "flex", justifyContent: "center"}}>
    //             {mouseTransfer || catTransfer || mouseTrapTransfer ? (
    //               <Button
    //                   variant="outlined"
    //                   color="primary"
    //                   style={{marginBottom: "3%", marginTop: "3%"}}
    //                   disabled={isPendingTxn(pendingTransactions, "transfer_nft")}
    //                   onClick={() => {dispatch(transferNFT({ address, toAddress, id, amount: transferAmount, provider: provider, networkID: chainID })), setConfirmModal(false), setToAddress(null), setTransferAmount(null), setId(null), setMouseTransfer(null), setCatTransfer(null), setMouseTrapTransfer(null), setTransferID(null), setTransferModal(false)}}
    //                 >
    //                   {txnButtonText(pendingTransactions, "Transferring", "Transfer")}
    //               </Button>
    //             ) : (
    //               <Button
    //               variant="outlined"
    //               color="primary"
    //               style={{marginBottom: "3%", marginTop: "3%"}}
    //               disabled={isPendingTxn(pendingTransactions, "transfer_nft")}
    //               onClick={() => {dispatch(transferPass({ address, toAddress, id: 0, amount: transferAmount, provider: provider, networkID: chainID })), setConfirmModal(false), setToAddress(null), setTransferAmount(null), setId(null), setMouseTransfer(null), setCatTransfer(null), setMouseTrapTransfer(null), setTransferID(null), setTransferModal(false)}}
    //             >
    //               {txnButtonText(pendingTransactions, "Transferring", "Transfer")}
    //           </Button>
    //             )}
    //             </Box>
    //           </Box>
    //         </Modal>
    //       </Box>
    //     ) : (
    //       <></>
    //     )}
    //       <Box style={{display: "flex", justifyContent: "center"}}>
    //         <Button
    //           variant="outlined"
    //           color="primary"
    //           style={{marginBottom: listingModal ? '1%' : "3%", marginTop: "1.5%", width: "33%"}}
    //           onClick={() => {setListingModal(true)}}
    //         >
    //           Create a Listing
    //         </Button>
    //       </Box>
    //     {listingModal === true ? (
    //       <Box>
    //         <Typography variant="h6" color="textPrimary" style={{textAlign: "center", margin: "0 auto", paddingBottom: "2%"}}>Which One?</Typography>
    //         <Grid container style={{display: "flex", flexFlow: "row-nowrap", justifyContent: "center", marginLeft: verySmallScreen ? "27%" : smallerScreen ? "14%" : "7%", marginBottom: "3%"}}>
    //                   <Grid item style={{width: "250px", margin: "0 auto", marginBottom: verySmallScreen ? "5%" : smallerScreen ? "3%" : "0"}}>
    //                   <Paper onClick={() => {
    //                     setMouseSelect(true)
    //                     setTrapSelect(false)
    //                     setPassSelect(false)
    //                     setCatSelect(false)
    //                     }}  style={{display: "flex", flexDirection: "row", justifyContent: "center", width: "40%", background: "transparent", border: `1px solid ${mouseSelect ? "#ebc50c" : "#3ce8a6"}`}}>
    //                     <div style={{display: "flex", justifyContent: "center"}}>
    //                       <img src={Mouse} alt="mouse trap mouse pixelated" style={{height: "60px", height: "60px"}} />
    //                     </div>
    //                   </Paper>
    //                   </Grid>
    //                   <Grid item style={{width: "250px", margin: "0 auto", marginBottom: verySmallScreen ? "5%" : smallerScreen ? "3%" : "0"}}>
    //                   <Paper onClick={() => {
    //                     setCatSelect(true)
    //                     setPassSelect(false)
    //                     setTrapSelect(false)
    //                     setMouseSelect(false)
    //                     }} style={{display: "flex", flexDirection: "row", justifyContent: "center", width: "40%", background: "transparent", border: `1px solid ${catSelect ? "#ebc50c" : "#3ce8a6"}`}}>
    //                     <div style={{display: "flex", justifyContent: "center"}}>
    //                       <img src={Cat} alt="mouse trap cat pixelated" style={{height: "60px", height: "60px"}} />
    //                     </div>
    //                   </Paper>
    //                   </Grid>
    //                   <Grid item style={{width: "250px", margin: "0 auto", marginBottom: verySmallScreen ? "5%" : smallerScreen ? "3%" : "0"}}>
    //                   <Paper onClick={() => {
    //                     setTrapSelect(true)
    //                     setPassSelect(false)
    //                     setMouseSelect(false)
    //                     setCatSelect(false)
    //                     }} style={{display: "flex", flexDirection: "row", justifyContent: "center", width: "40%", background: "transparent", border: `1px solid ${trapSelect ? "#ebc50c" : "#3ce8a6"}`}}>
    //                     <div style={{display: "flex", justifyContent: "center"}}>
    //                       <img src={MouseTrap} alt="mouse trap mousetrap pixelated" style={{height: "60px", height: "60px"}} />
    //                     </div>
    //                   </Paper>
    //                   </Grid>
    //                   <Grid item style={{width: "250px", margin: "0 auto", marginBottom: verySmallScreen ? "5%" : smallerScreen ? "3%" : "0"}}>
    //                   <Paper onClick={() => {
    //                     setPassSelect(true)
    //                     setCatSelect(false)
    //                     setTrapSelect(false)
    //                     setMouseSelect(false)
    //                     }} style={{display: "flex", flexDirection: "row", justifyContent: "center", width: "40%", background: "transparent", border: `1px solid ${passSelect ? "#ebc50c" : "#3ce8a6"}`}}>
    //                     <div style={{display: "flex", justifyContent: "center"}}>
    //                       <img src={CheezPassGif} alt="cheez pass rotating" style={{height: "60px", height: "60px"}} />
    //                     </div>
    //                   </Paper>
    //                   </Grid>
    //                 </Grid>
    //             {mouseSelect === true || catSelect === true || trapSelect === true ? (
    //               <Box style={{display: "flex", flexDireciton: "row", justifyContent: "space-evenly"}}>
    //               <Box style={{display: "flex", flexDirection: "column"}}>
    //               <Typography variant="h6" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "5%", marginBottom: "2%", marginLeft: "2%"}}>How Many {mouseSelect ? 'Mice' : catSelect ? 'Cats' : trapSelect ? 'Traps' : ''}?</Typography>
    //               <Box style={{display: "flex", justifyContent: "center"}}>
    //                 <TextField
    //                   id="filled-number"
    //                   label="Quantity"
    //                   type="number"
    //                   value={amount}
    //                   onChange={(e) => {setAmount(e.target.value)}}
    //                   InputLabelProps={{
    //                     shrink: true,
    //                   }}
    //                   variant="outlined"
    //                 />
    //               </Box>
    //               <Box style={{display: "flex", flexDirection: "column"}}>
    //               <Typography variant="h6" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "5%", marginBottom: "2%", marginLeft: "2%"}}>Price of Each (in 🧀)</Typography>
    //               <Box style={{display: "flex", justifyContent: "center", marginBottom: "10%"}}>
    //                 <TextField
    //                   id="filled-number"
    //                   label="Price in CHEEZ"
    //                   type="number"
    //                   value={listPrice}
    //                   onChange={(e) => {setListPrice(e.target.value)}}
    //                   InputLabelProps={{
    //                     shrink: true,
    //                   }}
    //                   variant="outlined"
    //                 />
    //               </Box>
    //               </Box>
    //               </Box>
    //               <Box style={{display: "flex", justifyContent: "space-evenly", width: "25%"}}>
    //               {approvalStatus === false ? (
    //               <Button
    //                 variant="outlined"
    //                 color="primary"
    //                 style={{marginBottom: "3%", marginTop: "33%"}}
    //                 onClick={onSeekApproval}
    //               >
    //                 Approve
    //               </Button>
    //               ) : (
    //                 <Button
    //                 variant="outlined"
    //                 color="primary"
    //                 style={{marginBottom: "3%", marginTop: "33%"}}
    //                 onClick={onList}
    //               >
    //                 Confirm
    //               </Button>
    //               )}
    //                                   <Button
    //                 variant="outlined"
    //                 color="primary"
    //                 style={{marginBottom: "3%", marginTop: "33%"}}
    //                 onClick={onCancelList}
    //               >
    //                 Cancel
    //               </Button>
    //               </Box>
    //             </Box>
    //             ) : (<></>)}
    //             {passSelect === true ? (
    //               <Box style={{display: "flex", flexDireciton: "row", justifyContent: "space-evenly"}}>
    //               <Box style={{display: "flex", flexDirection: "column"}}>
    //               <Typography variant="h6" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "5%", marginBottom: "2%", marginLeft: "2%"}}>How Many {passSelect ? 'Passes' : ''}?</Typography>
    //               <Box style={{display: "flex", justifyContent: "center"}}>
    //                 <TextField
    //                   id="filled-number"
    //                   label="Quantity"
    //                   type="number"
    //                   value={amount}
    //                   onChange={(e) => {setAmount(e.target.value)}}
    //                   InputLabelProps={{
    //                     shrink: true,
    //                   }}
    //                   variant="outlined"
    //                 />
    //               </Box>
    //               <Box style={{display: "flex", flexDirection: "column"}}>
    //               <Typography variant="h6" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "5%", marginBottom: "2%", marginLeft: "2%"}}>Price of Each (in 🧀)</Typography>
    //               <Box style={{display: "flex", justifyContent: "center", marginBottom: "10%"}}>
    //                 <TextField
    //                   id="filled-number"
    //                   label="Price in CHEEZ"
    //                   type="number"
    //                   value={listPrice}
    //                   onChange={(e) => {setListPrice(e.target.value)}}
    //                   InputLabelProps={{
    //                     shrink: true,
    //                   }}
    //                   variant="outlined"
    //                 />
    //               </Box>
    //               </Box>
    //               </Box>
    //               <Box style={{display: "flex", justifyContent: "space-evenly", width: "25%"}}>
    //               {passApprovalStatus === false ? (
    //               <Button
    //                 variant="outlined"
    //                 color="primary"
    //                 style={{marginBottom: "3%", marginTop: "33%"}}
    //                 onClick={onSeekPassApproval}
    //               >
    //                 Approve
    //               </Button>
    //               ) : (
    //                 <Button
    //                 variant="outlined"
    //                 color="primary"
    //                 style={{marginBottom: "3%", marginTop: "33%"}}
    //                 onClick={onPassList}
    //               >
    //                 Confirm
    //               </Button>
    //               )}
    //               <Button
    //                 variant="outlined"
    //                 color="primary"
    //                 style={{marginBottom: "3%", marginTop: "33%"}}
    //                 onClick={onCancelList}
    //               >
    //                 Cancel
    //               </Button>
    //               </Box>
    //             </Box>
    //             ) : (<></>)}
    //       </Box>
    //     ) : (
    //       <></>
    //     )}
    //     <Paper style={{display: "flex", flexDirection: "row", justifyContent: "space-between", background: "transparent", border: "1px solid #3ce8a6", margin: "0 auto", marginBottom: "2%", width: "40%"}}>
    //     <Typography variant="h4" color="textPrimary" style={{textAlign: "center", margin: "0 auto", paddingTop: "2%", paddingBottom: "2%"}}>Your Listings</Typography>
    //     </Paper>
    //     {mouseBalance && catBalance && trapBalance ? (
    //       <>
    //       {myListings.length > 0 ? (
    //       <Box>
    //         {myListings.map((listing) => (
    //           <Box style={{display: "flex", justifyContent: "center"}}>
    //             <Paper style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly", background: "transparent", border: "1px solid #ebc50c", width: "70%", marginBottom: "2%"}}>
    //               <Box style={{marginBottom: "1.5%", marginTop: "1%"}}>
    //               {listing.tokenId === 0 && listing.amount > 1 && listing.token === addresses[chainID].NFT_CONTRACT_ADDRESS ? <img src={Mouse} alt="mouse icon" style={{height: "65px", width: "65px"}} /> : listing.tokenId === 0 && listing.amount <= 1 && listing.token === addresses[chainID].NFT_CONTRACT_ADDRESS ? <img src={Mouse} alt="mouse icon" style={{height: "65px", width: "65px"}} /> : listing.tokenId === 1 && listing.amount > 1 ? <img src={Cat} alt="cat icon" style={{height: "65px", width: "65px"}} /> : listing.tokenId === 2 && listing.amount > 1 ? <img src={MouseTrap} alt="mouse trap icon" style={{height: "65px", width: "65px"}} /> : listing.tokenId === 2 ? <img src={MouseTrap} alt="mouse trap icon" style={{height: "65px", width: "65px"}} /> : listing.tokenId === 1 ? <img src={Cat} alt="cat icon" style={{height: "65px", width: "65px"}} /> : listing.tokenId === 0 && listing.amount > 1 && listing.token === addresses[chainID].CHEEZPASS_CONTRACT_ADDRESS ? <img src={CheezPassGif} alt="spinning logo for cheesepass" style={{height: "65px", width: "65px"}} /> : listing.tokenId === 0 && listing.amount <= 1 && listing.token === addresses[chainID].CHEEZPASS_CONTRACT_ADDRESS ? <img src={CheezPassGif} alt="spinning logo for cheesepass" style={{height: "65px", width: "65px"}} /> : ''}
    //               </Box>
    //               <Box style={{marginTop: "2%"}}>
    //                 <Typography variant="h6" color="textPrimary" style={{textAlign: "center", marginTop: "3%"}}>Qty:</Typography>
    //                 <Typography variant="h5" color="textSecondary" style={{textAlign: "center"}}>{listing.amount}</Typography>
    //               </Box>
    //               <Box style={{marginTop: "4%", display: "flex", flexDirection: "row", width: "25%"}}>
    //                 <Typography variant="h5" color="textPrimary" style={{textAlign: "center"}}>Price:</Typography>
    //                 <Typography variant="h5" color="textSecondary" style={{textAlign: "center", marginLeft: "10%"}}>{ethers.utils.formatUnits(`${listing.price}`, 9)} 🧀</Typography>
    //               </Box>
    //               <Box style={{marginTop: "3.5%"}}>
    //               <Button
    //                 variant="outlined"
    //                 color="primary"
    //                 style={{width: "60%"}}
    //                 disabled={isPendingTxn(pendingTransactions, "delete_nft")}
    //                 onClick={() => {
    //                   onDelete(listing.offerId)
    //                 }}
    //               >
    //                 Remove
    //               </Button>
    //               </Box>
    //             </Paper>
    //           </Box>
    //         ))}
    //       </Box>
    //     ) : (
    //       <> 
    //         <Typography variant="h2" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "5%", marginBottom: "2%"}}>No listings yet, create a listing <span className="hover" style={{textDecoration: "underline"}} onClick={() => {setListingModal(true)}}>here.</span></Typography>
    //       </>
    //     )}
    //       </>
    //     ) : (
    //     <> 
    //       <Skeleton type="text" width="400px" style={{margin: "0 auto", marginTop: "10%"}} />
    //     </>)}
    //       </Container>
    // </div>
  );
}

export default Spawns;
