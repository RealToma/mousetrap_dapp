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
import { Col, Row, Button, Modal, Table } from "react-bootstrap";
import { responsiveFontSizes } from '@material-ui/core/styles';
import { storeQueryParameters } from './../../helpers/QueryParameterHelper';


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

  const [transferNftModal, setTransferNftModal] = useState(false);
  const transferNftModalClose = () => setTransferNftModal(false);
  const transferNftModalShow = () => setTransferNftModal(true);

  const [createNftModal, setCreateNftModal] = useState(false);
  const createNftModalClose = () => setCreateNftModal(false);
  const createNftModalShow = () => setCreateNftModal(true);

  const [transferNftNextModal, setTransferNftNextModal] = useState(false);
  const transferNftNextModalClose = () => setTransferNftNextModal(false);
  const transferNftNextModalShow = () => setTransferNftNextModal(true);


  const [active, setActive] = useState(1);
  const [amontArr, setAmountArr] = useState(false);

  const settransferNFTsvalidation = () => {
    if (transferAmount > 0) {
      setAmountArr(false);
      setActive(1)
      setMouseSelect(true)
      setTrapSelect(false)
      setPassSelect(false)
      setCatSelect(false)
      transferNftModalClose();
      transferNftNextModalShow();
    } else {
      setAmountArr(true)
    }
  }
  const createListValidationForPass = () => {
    if (amount > 0) {
      setAmountArr(false);
      setActive(1)
      setMouseSelect(true)
      setTrapSelect(false)
      setPassSelect(false)
      setCatSelect(false)
      createNftModalClose();
      onSeekPassApproval();
    } else {
      setAmountArr(true)
    }
  }
  const createListingValidation = () => {
    if (amount > 0) {
      setAmountArr(false);
      setActive(1)
      setMouseSelect(true)
      setTrapSelect(false)
      setPassSelect(false)
      setCatSelect(false)
      createNftModalClose();
      onSeekApproval();
    } else {
      setAmountArr(true)
    }
  }

  return (
    <>
      <div className="main-nfts px-3">
        <Row className="justify-content-center">
          <Col lg={3} md={6} sm={12} className="mt-3">
            <div className="nft-box">
              <img src={require('./mouse.png').default} alt="" width={150} />
              <h3>Mouse</h3>
              <p>x0</p>
            </div>
          </Col>
          <Col lg={3} md={6} sm={12} className="mt-3">
            <div className="nft-box">
              <img src={require('./cat.png').default} alt="" width={150} />
              <h3>Cat</h3>
              <p>x0</p>
            </div>
          </Col>
          <Col lg={3} md={6} sm={12} className="mt-3">
            <div className="nft-box">
              <img src={require('./mouse-trap.png').default} alt="" width={150} />
              <h3>Trap</h3>
              <p>x0</p>
            </div>
          </Col>
          <Col lg={3} md={6} sm={12} className="mt-3">
            <div className="nft-box">
              <img src={require('./cheezpass.gif').default} alt="" width={150} />
              <h3>CHEEZ Pass</h3>
              <p>x0</p>
            </div>
          </Col>
        </Row>
        <div className="d-flex justify-content-center mt-5">

          {!address ? (
            <><Button className="transfer">Transfer NFTs</Button></>
          ) : (
            <>
              <Button className="transfer" onClick={transferNftModalShow}>Transfer NFTs</Button>
            </>
          )}

        </div>
        {!address ? (
          <>
            <div className="get-start-main mt-5">
              <Row className="align-items-center w-100">
                <Col lg={9} md={12}>
                  <p>No listing yet, create a listing here for sale on the marketplace.</p>
                </Col>
                <Col lg={3} md={12}>
                  <div>
                    <Button className="start-btn">Create a Listing</Button>
                  </div>
                </Col>
              </Row>
            </div>
          </>
        ) : (
          <>
            {mouseBalance && catBalance && trapBalance ? (
              <>
                {myListings.length > 0 ? (
                  <div className="list-main mt-5">
                    <div className="list-header d-flex align-items-center justify-content-between">
                      <h2>Your Listings</h2>
                      <Button className="create-btn">Create a Listing</Button>
                    </div>
                    <div className="list-table">
                      <Table responsive>
                        <tbody>
                          {myListings.map((listing) => (
                            <tr>
                              <td>
                                <div className="d-flex align-items-center">

                                  {listing.tokenId === 0 && listing.amount > 1 && listing.token === addresses[chainID].NFT_CONTRACT_ADDRESS ? <img src={Mouse} alt="mouse icon" style={{ height: "65px", width: "65px" }} /> : listing.tokenId === 0 && listing.amount <= 1 && listing.token === addresses[chainID].NFT_CONTRACT_ADDRESS ? <img src={Mouse} alt="mouse icon" style={{ height: "65px", width: "65px" }} /> : listing.tokenId === 1 && listing.amount > 1 ? <img src={Cat} alt="cat icon" style={{ height: "65px", width: "65px" }} /> : listing.tokenId === 2 && listing.amount > 1 ? <img src={MouseTrap} alt="mouse trap icon" style={{ height: "65px", width: "65px" }} /> : listing.tokenId === 2 ? <img src={MouseTrap} alt="mouse trap icon" style={{ height: "65px", width: "65px" }} /> : listing.tokenId === 1 ? <img src={Cat} alt="cat icon" style={{ height: "65px", width: "65px" }} /> : listing.tokenId === 0 && listing.amount > 1 && listing.token === addresses[chainID].CHEEZPASS_CONTRACT_ADDRESS ? <img src={CheezPassGif} alt="spinning logo for cheesepass" style={{ height: "65px", width: "65px" }} /> : listing.tokenId === 0 && listing.amount <= 1 && listing.token === addresses[chainID].CHEEZPASS_CONTRACT_ADDRESS ? <img src={CheezPassGif} alt="spinning logo for cheesepass" style={{ height: "65px", width: "65px" }} /> : ''}

                                  <h5 className="mb-0">CHEEZ Pass</h5>
                                </div>
                              </td>
                              <td>
                                <div className="td-con">
                                  <span>Qty:</span>
                                  <h5>{listing.amount}</h5>
                                </div>
                              </td>
                              <td>
                                <div className="td-con">
                                  <span>Price:</span>
                                  <h5>{ethers.utils.formatUnits(`${listing.price}`, 9)} 🧀</h5>
                                </div>
                              </td>
                              <td>
                                <Button className="remove" disabled={isPendingTxn(pendingTransactions, "delete_nft")}
                                  onClick={() => {
                                    onDelete(listing.offerId)
                                  }}>Remove</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="get-start-main mt-5">
                      <Row className="align-items-center w-100">
                        <Col lg={9} md={12}>
                          <p>No listing yet, create a listing here for sale on the marketplace.</p>
                        </Col>
                        <Col lg={3} md={12}>
                          <div>
                            <Button className="start-btn" onClick={createNftModalShow}>Create a Listing</Button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <Skeleton type="text" width="400px" style={{ margin: "0 auto", marginTop: "10%" }} />
              </>)}

          </>
        )}
      </div>

      <Modal show={transferNftModal} onHide={() => {
        transferNftModalClose()
        setActive(1)
        setMouseSelect(true)
        setTrapSelect(false)
        setPassSelect(false)
        setCatSelect(false)
      }}>
        <Modal.Body className="modal-bg">
          <button style={{
            position: "absolute",
            right: "0",
            top: "-1px",
            height: "24px",
            width: "24px",
            background: "transparent",
            border: "none"
          }} onClick={transferNftModalClose}></button>
          <h3>Transfer NFT</h3>
          <Box>
            {transferID === null ? (
              <Box>
                <Grid container style={{ columnGap: '20px', display: "flex", flexFlow: "row-nowrap", justifyContent: "center" }}>
                  <div className="main-modal-box text-center">
                    <Grid item className={`${active === 1 ? "active" : ""} border-box`} style={{ margin: "0 auto", marginBottom: verySmallScreen ? "5%" : smallerScreen ? "3%" : "0" }}>
                      <Paper style={{ display: "flex", flexDirection: "row", justifyContent: "center", background: "transparent" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <img src={Mouse} alt="mouse trap mouse pixelated" style={{ height: "60px", height: "60px" }} />
                        </div>
                      </Paper>
                    </Grid>
                    <input className={`${active === 1 ? "active" : ""} mt-2 checkbox`} type="radio" name="name" onClick={() => {
                      setActive(1)
                      setMouseTransfer(true)
                      setMouseTrapTransfer(false)
                      setPassTransfer(false)
                      setCatTransfer(false)
                    }} />
                  </div>
                  <div className="main-modal-box text-center">
                    <Grid item className={`${active === 2 ? "active" : ""} border-box`} style={{ margin: "0 auto", marginBottom: verySmallScreen ? "5%" : smallerScreen ? "3%" : "0" }}>
                      <Paper style={{ display: "flex", flexDirection: "row", justifyContent: "center", background: "transparent" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <img src={Cat} alt="mouse trap cat pixelated" style={{ height: "60px", height: "60px" }} />
                        </div>
                      </Paper>
                    </Grid>
                    <input className={`${active === 2 ? "active" : ""} mt-2 checkbox`} type="radio" name="name" onClick={() => {
                      setActive(2)
                      setCatTransfer(true)
                      setPassTransfer(false)
                      setMouseTrapTransfer(false)
                      setMouseTransfer(false)
                    }} />
                  </div>
                  <div className="main-modal-box text-center">
                    <Grid item className={`${active === 3 ? "active" : ""} border-box`} style={{ margin: "0 auto", marginBottom: verySmallScreen ? "5%" : smallerScreen ? "3%" : "0" }}>
                      <Paper style={{ display: "flex", flexDirection: "row", justifyContent: "center", background: "transparent" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <img src={MouseTrap} alt="mouse trap mousetrap pixelated" style={{ height: "60px", height: "60px" }} />
                        </div>
                      </Paper>
                    </Grid>
                    <input className={`${active === 3 ? "active" : ""} mt-2 checkbox`} type="radio" name="name" onClick={() => {
                      setActive(3)
                      setMouseTrapTransfer(true)
                      setPassTransfer(false)
                      setMouseTransfer(false)
                      setCatTransfer(false)
                    }} />
                  </div>
                  <div className="main-modal-box text-center">
                    <Grid item className={`${active === 4 ? "active" : ""} border-box`} style={{ margin: "0 auto", marginBottom: verySmallScreen ? "5%" : smallerScreen ? "3%" : "0" }}>
                      <Paper style={{ display: "flex", flexDirection: "row", justifyContent: "center", background: "transparent" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <img src={CheezPassGif} alt="cheez pass rotating" style={{ height: "60px", height: "60px" }} />
                        </div>
                      </Paper>
                    </Grid>
                    <input className={`${active === 4 ? "active" : ""} mt-2 checkbox`} type="radio" name="name" onClick={() => {
                      setActive(4)
                      setPassTransfer(true)
                      setCatTransfer(false)
                      setMouseTrapTransfer(false)
                      setMouseTransfer(false)
                    }} />
                  </div>
                </Grid>

                <div className="amount-box mt-5">
                  <div>
                    <span>Amount</span>
                    <input className="amount-fild mt-2" type="text" onChange={(e) => { setTransferAmount(e.target.value); }} />
                  </div>
                  <div className="mt-3">
                    <span>0x Formatted address</span>
                    <input className="amount-fild mt-2" type="text" onChange={(e) => { setToAddress(e.target.value) }} />
                  </div>
                </div>
                {amontArr && <span className="amount-arr">Please fill amount more then 0.</span>}
                <div className="d-flex justify-content-center mt-3">
                  <Button className="transfer-btn" onClick={() => { settransferNFTsvalidation(); }}>Confirm transfer</Button>
                </div>
              </Box>
            ) : (
              <></>
            )}
          </Box>

        </Modal.Body>
      </Modal>


      <Modal show={transferNftNextModal} onHide={transferNftNextModalClose}>
        <Modal.Body className="modal-bg text-center">
          <button style={{
            position: "absolute",
            right: "0",
            top: "-1px",
            height: "24px",
            width: "24px",
            background: "transparent",
            border: "none"
          }} onClick={transferNftNextModalClose}></button>
          <div className="text-modal">
            <h2 className="text-pink">Caution!</h2>
            <p className="text-pink">This is on-chain, and cannot be reversed!</p>
          </div>
          <div className="gray-text">
            <span>You are sending</span>
            <h2>
              {transferAmount}{transferAmount == 1 && mouseTransfer ? 'Mouse' : transferAmount > 1 && mouseTransfer ? 'Mice' : transferAmount == 1 && catTransfer ? 'Cat' : transferAmount > 1 && catTransfer ? 'Cats' : transferAmount == 1 && mouseTrapTransfer ? 'Trap' : transferAmount > 1 && mouseTrapTransfer ? 'Traps' : transferAmount == 1 && passTransfer ? 'Pass' : transferAmount > 1 && passTransfer ? 'Passes' : ''}
            </h2>
          </div>
          <div className="gray-text">
            <span>To</span>
            <p>{toAddress}</p>
          </div>
          <div className="d-flex justify-content-center mt-3">

            {mouseTransfer || catTransfer || mouseTrapTransfer ? (
              <Button
                className="transfer-btn"
                disabled={isPendingTxn(pendingTransactions, "transfer_nft")}
                onClick={() => { dispatch(transferNFT({ address, toAddress, id, amount: transferAmount, provider: provider, networkID: chainID })), setConfirmModal(false), setToAddress(null), setTransferAmount(null), setId(null), setMouseTransfer(null), setCatTransfer(null), setMouseTrapTransfer(null), setTransferID(null), setTransferModal(false); transferNftModalClose(); transferNftNextModalShow(); }}
              >
                {txnButtonText(pendingTransactions, "Transferring", "Transfer")}
              </Button>
            ) : (
              <Button
                className="transfer-btn"
                disabled={isPendingTxn(pendingTransactions, "transfer_nft")}
                onClick={() => { dispatch(transferPass({ address, toAddress, id: 0, amount: transferAmount, provider: provider, networkID: chainID })), setConfirmModal(false), setToAddress(null), setTransferAmount(null), setId(null), setMouseTransfer(null), setCatTransfer(null), setMouseTrapTransfer(null), setTransferID(null), setTransferModal(false); transferNftModalClose(); transferNftNextModalShow(); }}
              >
                {txnButtonText(pendingTransactions, "Transferring", "Transfer")}
              </Button>
            )}
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={createNftModal} onHide={() => {
        createNftModalClose(),
          setActive(1)
        setMouseSelect(true)
        setTrapSelect(false)
        setPassSelect(false)
        setCatSelect(false)
      }}>
        <Modal.Body className="modal-bg">
          <button style={{
            position: "absolute",
            right: "0",
            top: "-1px",
            height: "24px",
            width: "24px",
            background: "transparent",
            border: "none"
          }} onClick={createNftModalClose}></button>
          <h3>Create a Listing</h3>

          <Box>
            {transferID === null ? (
              <Box>
                <Grid container style={{ columnGap: '20px', display: "flex", flexFlow: "row-nowrap", justifyContent: "center" }}>
                  <div className="main-modal-box text-center">
                    <Grid item className={`${active === 1 ? "active" : ""} border-box`} style={{ margin: "0 auto", marginBottom: verySmallScreen ? "5%" : smallerScreen ? "3%" : "0" }}>
                      <Paper style={{ display: "flex", flexDirection: "row", justifyContent: "center", background: "transparent" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <img src={Mouse} alt="mouse trap mouse pixelated" style={{ height: "60px", height: "60px" }} />
                        </div>
                      </Paper>
                    </Grid>
                    <input className={`${active === 1 ? "active" : ""} mt-2 checkbox`} type="radio" name="name" onClick={() => {
                      setActive(1)
                      setMouseSelect(true)
                      setTrapSelect(false)
                      setPassSelect(false)
                      setCatSelect(false)
                    }} />
                  </div>
                  <div className="main-modal-box text-center">
                    <Grid item className={`${active === 2 ? "active" : ""} border-box`} style={{ margin: "0 auto", marginBottom: verySmallScreen ? "5%" : smallerScreen ? "3%" : "0" }}>
                      <Paper style={{ display: "flex", flexDirection: "row", justifyContent: "center", background: "transparent" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <img src={Cat} alt="mouse trap cat pixelated" style={{ height: "60px", height: "60px" }} />
                        </div>
                      </Paper>
                    </Grid>
                    <input className="mt-2 checkbox" type="radio" name="name" onClick={() => {
                      setActive(2)
                      setCatSelect(true)
                      setPassSelect(false)
                      setTrapSelect(false)
                      setMouseSelect(false)
                    }} />
                  </div>
                  <div className="main-modal-box text-center">
                    <Grid item className={`${active === 3 ? "active" : ""} border-box`} style={{ margin: "0 auto", marginBottom: verySmallScreen ? "5%" : smallerScreen ? "3%" : "0" }}>
                      <Paper style={{ display: "flex", flexDirection: "row", justifyContent: "center", background: "transparent" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <img src={MouseTrap} alt="mouse trap mousetrap pixelated" style={{ height: "60px", height: "60px" }} />
                        </div>
                      </Paper>
                    </Grid>
                    <input className="mt-2 checkbox" type="radio" name="name" onClick={() => {
                      setActive(3)
                      setTrapSelect(true)
                      setPassSelect(false)
                      setMouseSelect(false)
                      setCatSelect(false)
                    }} />
                  </div>
                  <div className="main-modal-box text-center">
                    <Grid item className={`${active === 4 ? "active" : ""} border-box`} style={{ margin: "0 auto", marginBottom: verySmallScreen ? "5%" : smallerScreen ? "3%" : "0" }}>
                      <Paper style={{ display: "flex", flexDirection: "row", justifyContent: "center", background: "transparent" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <img src={CheezPassGif} alt="cheez pass rotating" style={{ height: "60px", height: "60px" }} />
                        </div>
                      </Paper>
                    </Grid>
                    <input className="mt-2 checkbox" type="radio" name="name" onClick={() => {
                      setActive(4)
                      setPassSelect(true)
                      setCatSelect(false)
                      setTrapSelect(false)
                      setMouseSelect(false)
                    }} />
                  </div>
                </Grid>
                {mouseSelect === true || catSelect === true || trapSelect === true ? (
                  <>
                    <div className="amount-box mt-5">
                      <div>
                        <span>How Many {mouseSelect ? 'Mice' : catSelect ? 'Cats' : trapSelect ? 'Traps' : ''}?</span>
                        <input className="amount-fild mt-2" type="text" onChange={(e) => { setAmount(e.target.value) }} />
                      </div>
                      <div className="mt-3">
                        <span>Price of Each (in 🧀)</span>
                        <input className="amount-fild mt-2" type="text"
                          onChange={(e) => { setListPrice(e.target.value) }}
                          InputLabelProps={{
                            shrink: true,
                          }} />
                      </div>
                    </div>
                    {amontArr && <span className="amount-arr">Please fill  {mouseSelect ? 'Mice' : catSelect ? 'Cats' : trapSelect ? 'Traps' : ''} more then 0.</span>}
                    <div className="d-flex justify-content-center mt-3">
                      <Button className="transfer-btn" onClick={() => { createListingValidation() }}>Create a Listing</Button>
                    </div>
                  </>
                ) : (<></>)}

                {passSelect === true ? (
                  <>
                    <div className="amount-box mt-5">
                      <div>
                        <span>How Many {passSelect ? 'Passes' : ''}?</span>
                        <input className="amount-fild mt-2" type="text" onChange={(e) => { setAmount(e.target.value) }} />
                      </div>
                      <div className="mt-3">
                        <span>Price of Each (in 🧀)</span>
                        <input className="amount-fild mt-2" type="text"
                          onChange={(e) => { setListPrice(e.target.value) }}
                          InputLabelProps={{
                            shrink: true,
                          }} />
                      </div>
                    </div>
                    {amontArr && <span className="amount-arr">Please fill {passSelect ? 'Passes' : ''} more then 0.</span>}
                    <div className="d-flex justify-content-center mt-3">
                      <Button className="transfer-btn" onClick={() => { createListValidationForPass() }}>Create a Listing</Button>
                    </div>
                  </>
                ) : (<></>)}
              </Box>
            ) : (
              <></>
            )}
          </Box>

        </Modal.Body>
      </Modal>


    </>
  );
}

export default Spawns;
