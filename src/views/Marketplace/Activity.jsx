import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { shorten } from "../../helpers";
import { addresses } from "../../constants";
import { Skeleton } from "@material-ui/lab";
import {
  Box,
  Button,
  Container,
  Paper,
  useMediaQuery,
  Modal,
  FormControl,
  TextField,
  Divider,
  Grid,
  Typography,
} from "@material-ui/core";

import { useAppSelector } from "react-redux";
import { loadAccountDetails, getBalances } from "../../slices/AccountSlice";
import { getListings } from "../../slices/ListingSlice";
import { BuyListing, changeApproval } from "../../slices/BuySlice";
import { getListingsDsc } from "../../slices/ListingSliceDsc";
import { getCatListings } from "../../slices/CatListingSlice";
import { getCatListingsDsc } from "../../slices/CatListingSliceDsc";
import { getPassListings } from "../../slices/PassAscSlice";
import { getPassListingsDsc } from "../../slices/PassDscSlice";
import { getTrapListings } from "../../slices/TrapListingSlice";
import { getTrapListingsDsc } from "../../slices/TrapListingSliceDsc";
import { getHighestSales } from "../../slices/HighestSaleSlice"
import { isPendingTxn } from "src/slices/PendingTxnsSlice";

import { trim } from "../../helpers";
import "./spawns.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";

import Mouse from "./mouse.png";
import Cat from "./catlogo.png";
import MouseTrap from "./mousetrap.png";
import Plus from "./plus.png";
import CloseIcon from "./close.png";
import SortIcon from "./sort.png";
import PurchaseIcon from "./shop.png";
import CheezPassGif from "./cheezpass.gif";


function Activity() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  const [sales, setSales] = useState([])

  //merging

  const [catOpen, setCatOpen] = useState(false);
  const [mouseOpen, setMouseOpen] = useState(false);
  const [trapOpen, setTrapOpen] = useState(false);
  const [passOpen, setPassOpen] = useState(false);
  const [sort, setSort] = useState(false);
  const [mousePurchaseOrder, setMousePurchaseOrder] = useState(null);
  const [catPurchaseOrder, setCatPurchaseOrder] = useState(null);
  const [trapPurchaseOrder, setTrapPurchaseOrder] = useState(null);
  const [passPurchaseOrder, setPassPurchaseOrder] = useState(null);
  const [mouseListingsFinalAsc, setMouseListingsFinalAsc] = useState([]);
  const [catListingsFinalAsc, setCatListingsFinalAsc] = useState([]);
  const [trapListingsFinalAsc, setTrapListingsFinalAsc] = useState([]);
  const [passListingsFinalAsc, setPassListingsFinalAsc] = useState([]);
  const [mouseListingsFinalDsc, setMouseListingsFinalDsc] = useState([]);
  const [catListingsFinalDsc, setCatListingsFinalDsc] = useState([]);
  const [trapListingsFinalDsc, setTrapListingsFinalDsc] = useState([]);
  const [passListingsFinalDsc, setPassListingsFinalDsc] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState(false);
  const [offerID, setOfferID] = useState(null);
  const accountDetails = useSelector(state => state.account)
  const { item } = useParams()  
  //Preview
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState(null);
  const [total, setTotal] = useState(null);
  const [available, setAvailable] = useState(1);
  const [mouseFloor, setMouseFloor] = useState(null);
  const [catFloor, setCatFloor] = useState(null);
  const [trapFloor, setTrapFloor] = useState(null);
  const [passFloor, setPassFloor] = useState(null);

  useEffect(() => {
    if(item){
      let it = item.toLowerCase()
      if(it == "mouse" || it == "mice"){
        setMouseOpen(true)
        setCatOpen(false)
        setTrapOpen(false)
        setPassOpen(false)
      } else if(it == "cat" || it == "cats"){
        setMouseOpen(false)
        setCatOpen(true)
        setTrapOpen(false)
        setPassOpen(false)
      } else if(it == "traps" || it == "trap" || it == "mousetraps" || it == "mousetrap"){
        setMouseOpen(false)
        setCatOpen(false)
        setTrapOpen(true)
        setPassOpen(false)
      } else if(it == "pass" || it == "passes"){
        setPassOpen(true)
        setMouseOpen(false)
        setCatOpen(false)
        setTrapOpen(false)
      }
    }
  }, [item])

  useEffect(() => {
    dispatch(loadAccountDetails({ networkID: chainID, address, provider: provider }))
    if(approvalStatus === false) {
      if(accountDetails.minting) {
        setApprovalStatus(accountDetails.minting.marketplaceCheezAllowance.gte(ethers.utils.parseUnits("1", 9)))
      }
    }
  }, [loadAccountDetails, accountDetails.minting, approvalStatus, address])

  const cheezBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ohm;
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

  const mouseListings = useSelector(state => state.listings)
  const catListings = useSelector(state => state.catListings)
  const trapListings = useSelector(state => state.trapListings)
  const passListings = useSelector(state => state.passListings)
  const mouseListingsDsc = useSelector(state => state.listingsDsc)
  const catListingsDsc = useSelector(state => state.catListingsDsc)
  const trapListingsDsc = useSelector(state => state.trapListingsDsc)
  const passListingsDsc = useSelector(state => state.passListingsDsc)
  const allSales = useSelector(state => state.highSales)

  useEffect(() => {
    Object.keys(allSales).forEach((key) => {
      sales.push(allSales[key])
    })
  }, [allSales, sales])

  useEffect(() => {
    dispatch(getListings()),
    dispatch(getListingsDsc()),
    dispatch(getCatListings()),
    dispatch(getCatListingsDsc()),
    dispatch(getTrapListings()),
    dispatch(getTrapListingsDsc()),
    dispatch(getPassListings()),
    dispatch(getPassListingsDsc()),
    dispatch(getHighestSales())
  }, [dispatch])

  useEffect(() => {
    setOfferID(mousePurchaseOrder || trapPurchaseOrder || catPurchaseOrder || passPurchaseOrder)
  }, [mousePurchaseOrder, trapPurchaseOrder, catPurchaseOrder, passPurchaseOrder])

  const onBuy = async () => {
    await dispatch(BuyListing({ provider, amount, address, offerID }));
    setMousePurchaseOrder(null)
    setCatPurchaseOrder(null)
    setTrapPurchaseOrder(null)
    setPassPurchaseOrder(null)
    setAmount(null)
    setTotal(null)
    setFrom(null)
    setAvailable(null)
  };

  useEffect(() => {
    let arr = []
    Object.keys(mouseListings).forEach((key) => {
      arr.push(mouseListings[key])
    })
    setMouseListingsFinalAsc(arr)

    arr = []
    Object.keys(mouseListingsDsc).forEach((key) => {
      arr.push(mouseListingsDsc[key])
    })
    setMouseListingsFinalDsc(arr)

    arr = []
    Object.keys(catListings).forEach((key) => {
      arr.push(catListings[key])
    })
    setCatListingsFinalAsc(arr)

    arr = []
    Object.keys(catListingsDsc).forEach((key) => {
      arr.push(catListingsDsc[key])
    })
    setCatListingsFinalDsc(arr)

    arr = []
    Object.keys(trapListings).forEach((key) => {
      arr.push(trapListings[key])
    })
    setTrapListingsFinalAsc(arr)

    arr = []
    Object.keys(trapListingsDsc).forEach((key) => {
      arr.push(trapListingsDsc[key])
    })
    setTrapListingsFinalDsc(arr)

    arr = []
    Object.keys(passListings).forEach((key) => {
      arr.push(passListings[key])
    })
    setPassListingsFinalAsc(arr)

    arr = []
    Object.keys(passListingsDsc).forEach((key) => {
      arr.push(passListingsDsc[key])
    })
    setPassListingsFinalDsc(arr)
}, [mouseListings, mouseListingsDsc, catListings, catListingsDsc, trapListings, trapListingsDsc, passListings, passListingsDsc])

    useEffect(() => {
      if (mouseListingsFinalAsc != null || undefined) {
        const mouseFloorGrab = mouseListingsFinalAsc[0]
        setMouseFloor(mouseFloorGrab)
      }
      if (catListingsFinalAsc != null || undefined) {
        const catFloorGrab = catListingsFinalAsc[0]
        setCatFloor(catFloorGrab)
      }
      if (trapListingsFinalAsc != null || undefined) {
        const trapFloorGrab = trapListingsFinalAsc[0]
        setTrapFloor(trapFloorGrab)
      }
      if (passListingsFinalAsc != null || undefined) {
        const passFloorGrab = passListingsFinalAsc[0]
        setPassFloor(passFloorGrab)
      }
    }) 

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, provider, networkID: chainID }));
  };

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

  const toggleMouseModal = () => {
    setMouseOpen(!mouseOpen)
  }

  const toggleCatModal = () => {
    setCatOpen(!catOpen)
  }

  const toggleTrapModal = () => {
    setTrapOpen(!trapOpen)
  }

  const togglePassModal = () => {
    setPassOpen(!passOpen)
  }

  const toggleSort = () => {
    setSort(!sort)
  }

  return (
    <div id="stake-view">
    <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? "0" : "3.3rem",
          paddingRight: smallerScreen || verySmallScreen ? "0" : "3.3rem",
        }}
    >
        <Paper style={{marginTop: "1%"}}>
        <Typography variant="h2" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>Season 1 Marketplace</Typography>
        </Paper>
        <Grid container spacing={4} justifyContent="center">
          <Grid item md={6} lg={3}>
          <Paper style={{display: "flex", flexDirection: "row", justifyContent: "space-between", background: "transparent", border: "1px solid #3ce8a6"}}>
            <Typography variant="h6" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "4%", marginBottom: "2%", marginLeft: "5%"}}>Floor:</Typography>
            <Typography variant="h4" color="textPrimary" style={{textAlign: "center", paddingTop: "1%", paddingBottom: "2%", marginTop: "5%", marginBottom: "2%", marginLeft: "2%"}}>{mouseFloor != null || undefined ? `${ethers.utils.formatUnits(`${mouseFloor.price}`, 9)}` : ''} 🧀</Typography>
            <div style={{display: "flex", justifyContent: "center", marginRight: "5%"}}>
              <img src={Mouse} alt="mouse trap mouse pixelated" style={{height: "60px", height: "60px"}} />
            </div>
          </Paper>
          </Grid>
          <Grid item md={6} lg={3}>
          <Paper style={{display: "flex", flexDirection: "row", justifyContent: "space-between", background: "transparent", border: "1px solid #3ce8a6"}}>
            <Typography variant="h6" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "4%", marginBottom: "2%", marginLeft: "5%"}}>Floor:</Typography>
            <Typography variant="h4" color="textPrimary" style={{textAlign: "center", paddingTop: "1%", paddingBottom: "2%", marginTop: "5%", marginBottom: "2%", marginLeft: "2%"}}>{catFloor != null || undefined ? `${ethers.utils.formatUnits(`${catFloor.price}`, 9)}` : ''} 🧀</Typography>
            <div style={{display: "flex", justifyContent: "center", marginRight: "5%"}}>
              <img src={Cat} alt="mouse trap cat pixelated" style={{height: "60px", height: "60px", marginRight: "5%"}} />
            </div>
          </Paper>
          </Grid>
          <Grid item md={6} lg={3}>
          <Paper style={{display: "flex", flexDirection: "row", justifyContent: "space-between", background: "transparent", border: "1px solid #3ce8a6"}}>
            <Typography variant="h6" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "4%", marginBottom: "2%", marginLeft: "5%"}}>Floor:</Typography>
            <Typography variant="h4" color="textPrimary" style={{textAlign: "center", paddingTop: "1%", paddingBottom: "2%", marginTop: "5%", marginBottom: "2%", marginLeft: "2%"}}>{trapFloor != null || undefined ? `${ethers.utils.formatUnits(`${trapFloor.price}`, 9)}` : ''} 🧀</Typography>
            <div style={{display: "flex", justifyContent: "center", marginRight: "5%"}}>
              <img src={MouseTrap} alt="mouse trap mousetrap pixelated" style={{height: "60px", height: "60px", marginRight: "5%"}} />
            </div>
          </Paper>
          </Grid>
          <Grid item md={6} lg={3}>
          <Paper style={{display: "flex", flexDirection: "row", justifyContent: "space-between", background: "transparent", border: "1px solid #3ce8a6"}}>
            <Typography variant="h6" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "4%", marginBottom: "2%", marginLeft: "5%"}}>Floor:</Typography>
            <Typography variant="h4" color="textPrimary" style={{textAlign: "center", paddingTop: "1%", paddingBottom: "2%", marginTop: "5%", marginBottom: "2%", marginLeft: "2%"}}>{passFloor != null || undefined ? `${ethers.utils.formatUnits(`${passFloor.price}`, 9)}` : ''} 🧀</Typography>
            <div style={{display: "flex", justifyContent: "center", marginRight: "5%"}}>
              <img src={CheezPassGif} alt="cheez pass spinning" style={{height: "60px", height: "60px"}} />
            </div>
          </Paper>
          </Grid>
        </Grid>
        <Box style={{display: "flex", justifyContent: "center", flexDirection: "column", marginTop: "2%"}}>
          <Paper style={{border: "1px solid #ebc50c", background: "transparent", margin: "0 auto", marginTop: "2%", width: "80%"}}>
            <Typography variant="h3" color="textPrimary" style={{textAlign: "center", marginBottom: "1%", marginTop: "1%"}}>Collect NFTs</Typography>
          </Paper>
          {cheezBalance ? (
          <Typography variant="body1" color="textPrimary" style={{textAlign: "center", paddingTop: "1%"}}>Your Available <span style={{color: "#ebc50c"}}>CHEEZ</span> {trim(cheezBalance, 4)} 🧀</Typography>
          ) : (
            <></>
          )}
        </Box>
        <Grid container justifyContent="center" spacing={4} style={{marginTop: ".5%"}}>
          <Grid item md={6} lg={3}>
          <Paper className="hover" style={{display: "flex", flexDirection: "column", justifyContent: "center", background: "transparent", border: "1px solid #3ce8a6"}}>
            <div style={{display: "flex", justifyContent: "center", marginRight: "5%"}}>
              <img src={Mouse} alt="mouse trap mouse pixelated" style={{height: "60px", height: "60px", padding: "3px"}} />
            </div>
            <div style={{width: "80%", display: "flex", justifyContent: "center"}}>
              <Button
                variant="outlined"
                color="primary"
                style={{marginLeft: "25%", marginBottom: "10%", marginTop: "5%"}}
                onClick={toggleMouseModal}
                disabled={catPurchaseOrder != null || trapPurchaseOrder != null}
              >
                View Listings
              </Button>
              <Modal
                open={mouseOpen}
                onClose={() => {setMouseOpen(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{overflow: 'scroll'}}
              >
                <Box>
                  <Box style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <Paper>
                      <Box style={{display: "flex", justifyContent: "flex-end", marginRight: "5%", paddingTop: "2%"}}>
                        <img className="hover" onClick={() => {setMouseOpen(false)}} src={CloseIcon} alt="close icon" style={{height: "15px", width: "15px"}} />
                      </Box>
                      <Typography variant="h2" style={{color: "#1ceb91", textAlign: "center", paddingTop: "2%", marginTop: "1%", marginBottom: "2%"}}>Current Mouse Listings</Typography>
                      <Box style={{display: "flex", flexFlow: "row-nowrap", justifyContent: "center"}}>
                        {sort === false ? (
                          <>
                            <Typography variant="h2" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>Low to High</Typography>
                            <img className="hover" onClick={toggleSort} src={SortIcon} alt="switch sort icon" style={{height: "30px", width: "30px", marginTop: "3.5%", marginLeft: "1.2%"}} />
                          </>
                        ) : (
                          <>
                            <Typography variant="h2" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>High to Low</Typography>
                            <img className="hover" onClick={toggleSort} src={SortIcon} alt="switch sort icon" style={{height: "30px", width: "30px", marginTop: "3.5%", marginLeft: "1.2%"}} />
                          </>
                        )}
                      </Box>
                      {sort === false ? (
                        <>
                      {mouseListingsFinalAsc.map((listing) => (
                        <Box>
                        <Paper style={{background: "transparent", border: "1px solid #ebc50c", width: "75%", display: "flex", flexFlow: "row nowrap", justifyContent: "space-evenly", margin: "0 auto", marginBottom: "2%", paddingTop: "2%", paddingBottom: "2%"}}>
                          <Typography variant="h4" color="textPrimary">Price {ethers.utils.formatUnits(`${listing.price}`, 9)} 🧀</Typography>
                          <Typography variant="h4" color="textPrimary">Owner: {shorten(`${listing.admin}`)}</Typography>
                          <Typography variant="h4" color="textPrimary">Qty: {listing.amount}</Typography>
                          <img src={PurchaseIcon} className="hover" onClick={() => {setMousePurchaseOrder(`${listing.offerId}`), toggleMouseModal(), setAmount(`${listing.amount}`), setTotal(`${listing.price}`), setFrom(`${listing.admin}`), setAvailable(`${listing.amount}`)}} alt="shop now icon" style={{width: "30px", height: "30px", paddingBottom: ".1%"}} />
                        </Paper>
                      </Box>
                      ))}
                      </>
                      ) : (
                        <>
                        {mouseListingsFinalDsc.map((listing) => (
                          <Box>
                          <Paper style={{background: "transparent", border: "1px solid #ebc50c", width: "75%", display: "flex", flexFlow: "row nowrap", justifyContent: "space-evenly", margin: "0 auto", marginBottom: "2%", paddingTop: "2%", paddingBottom: "2%"}}>
                            <Typography variant="h4" color="textPrimary">Price {ethers.utils.formatUnits(`${listing.price}`, 9)} 🧀</Typography>
                            <Typography variant="h4" color="textPrimary">Owner: {shorten(`${listing.admin}`)}</Typography>
                            <Typography variant="h4" color="textPrimary">Qty: {listing.amount}</Typography>
                            <img src={PurchaseIcon} className="hover" onClick={() => {setMousePurchaseOrder(`${listing.offerId}`), toggleMouseModal(), setAmount(`${listing.amount}`), setTotal(`${listing.price}`), setFrom(`${listing.admin}`), setAvailable(`${listing.amount}`)}} alt="shop now icon" style={{width: "30px", height: "30px", paddingBottom: ".1%"}} />
                          </Paper>
                        </Box>
                        ))}
                        </>
                      )}
                    </Paper>
                  </Box>
                </Box>
              </Modal>
            </div>
          </Paper>
          </Grid>
          <Grid item md={6} lg={3}>
          <Paper className="hover" style={{display: "flex", flexDirection: "column", justifyContent: "center", background: "transparent", border: "1px solid #3ce8a6"}}>
            <div style={{display: "flex", justifyContent: "center"}}>
              <img src={Cat} alt="mouse trap cat pixelated" style={{height: "60px", height: "60px", marginRight: "5%", padding: "5px"}} />
            </div>
            <div style={{width: "80%", display: "flex", justifyContent: "center"}}>
              <Button
                variant="outlined"
                color="primary"
                style={{marginLeft: "25%", marginBottom: "10%", marginTop: "5%"}}
                onClick={toggleCatModal}
                disabled={mousePurchaseOrder != null || trapPurchaseOrder != null}
              >
                View Listings
              </Button>
              <Modal
                open={catOpen}
                onClose={() => {setCatOpen(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{overflow: 'scroll'}}
              >
                <Box>
                  <Box style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <Paper>
                      <Box style={{display: "flex", justifyContent: "flex-end", marginRight: "5%", paddingTop: "2%"}}>
                        <img className="hover" onClick={() => {setCatOpen(false)}} src={CloseIcon} alt="close icon" style={{height: "15px", width: "15px"}} />
                      </Box>
                      <Typography variant="h2" style={{color: "#1ceb91", textAlign: "center", paddingTop: "2%", marginTop: "1%", marginBottom: "2%"}}>Current Cat Listings</Typography>
                      <Box style={{display: "flex", flexFlow: "row-nowrap", justifyContent: "center"}}>
                        {sort === false ? (
                          <>
                            <Typography variant="h2" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>Low to High</Typography>
                            <img className="hover" onClick={toggleSort} src={SortIcon} alt="switch sort icon" style={{height: "30px", width: "30px", marginTop: "3.5%", marginLeft: "1.2%"}} />
                          </>
                        ) : (
                          <>
                            <Typography variant="h2" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>High to Low</Typography>
                            <img className="hover" onClick={toggleSort} src={SortIcon} alt="switch sort icon" style={{height: "30px", width: "30px", marginTop: "3.5%", marginLeft: "1.2%"}} />
                          </>
                        )}
                      </Box>
                        {sort === false ? (
                          <>
                          {catListingsFinalAsc.map((listing) => (
                              <Box>
                              <Paper style={{background: "transparent", border: "1px solid #ebc50c", width: "75%", display: "flex", flexFlow: "row nowrap", justifyContent: "space-evenly", margin: "0 auto", marginBottom: "2%", paddingTop: "2%", paddingBottom: "2%"}}>
                                <Typography variant="h4" color="textPrimary">Price {ethers.utils.formatUnits(`${listing.price}`, 9)} 🧀</Typography>
                                <Typography variant="h4" color="textPrimary">Owner: {shorten(`${listing.admin}`)}</Typography>
                                <Typography variant="h4" color="textPrimary">Qty: {listing.amount}</Typography>
                                <img src={PurchaseIcon} className="hover" onClick={() => {setCatPurchaseOrder(`${listing.offerId}`), toggleCatModal(), setAmount(`${listing.amount}`), setTotal(`${listing.price}`), setFrom(`${listing.admin}`), setAvailable(`${listing.amount}`)}} alt="shop now icon" style={{width: "30px", height: "30px", paddingBottom: ".1%"}} />
                              </Paper>
                            </Box>
                            ))}
                          </>
                        ) : (
                          <>
                          {catListingsFinalDsc.map((listing) => (
                              <Box>
                              <Paper style={{background: "transparent", border: "1px solid #ebc50c", width: "75%", display: "flex", flexFlow: "row nowrap", justifyContent: "space-evenly", margin: "0 auto", marginBottom: "2%", paddingTop: "2%", paddingBottom: "2%"}}>
                                <Typography variant="h4" color="textPrimary">Price {ethers.utils.formatUnits(`${listing.price}`, 9)} 🧀</Typography>
                                <Typography variant="h4" color="textPrimary">Owner: {shorten(`${listing.admin}`)}</Typography>
                                <Typography variant="h4" color="textPrimary">Qty: {listing.amount}</Typography>
                                <img src={PurchaseIcon} className="hover" onClick={() => {setCatPurchaseOrder(`${listing.offerId}`), toggleCatModal(), setAmount(`${listing.amount}`), setTotal(`${listing.price}`), setFrom(`${listing.admin}`), setAvailable(`${listing.amount}`)}} alt="shop now icon" style={{width: "30px", height: "30px", paddingBottom: ".1%"}} />
                              </Paper>
                            </Box>
                            ))}
                          </>
                        )}
                    </Paper>
                  </Box>
                </Box>
              </Modal>
            </div>
          </Paper>
          </Grid>
          <Grid item md={6} lg={3}>
          <Paper className="hover" style={{display: "flex", flexDirection: "column", justifyContent: "center", background: "transparent", border: "1px solid #3ce8a6"}}>
            <div style={{display: "flex", justifyContent: "center"}}>
              <img src={MouseTrap} alt="mouse trap mousetrap pixelated" style={{height: "60px", height: "60px", marginRight: "5%"}} />
            </div>
            <div style={{width: "80%", display: "flex", justifyContent: "center"}}>
              <Button
                variant="outlined"
                color="primary"
                style={{marginLeft: "25%", marginBottom: "10%", marginTop: "5%"}}
                onClick={toggleTrapModal}
                disabled={mousePurchaseOrder != null || catPurchaseOrder != null}
              >
                View Listings
              </Button>
              <Modal
                open={trapOpen}
                onClose={() => {setTrapOpen(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{overflow: 'scroll'}}
              >
                <Box>
                  <Box style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <Paper>
                      <Box style={{display: "flex", justifyContent: "flex-end", marginRight: "5%", paddingTop: "2%"}}>
                        <img className="hover" onClick={() => {setTrapOpen(false)}} src={CloseIcon} alt="close icon" style={{height: "15px", width: "15px"}} />
                      </Box>
                      <Typography variant="h2" style={{color: "#1ceb91", textAlign: "center", paddingTop: "2%", marginTop: "1%", marginBottom: "2%"}}>Current MouseTrap Listings</Typography>
                      <Box style={{display: "flex", flexFlow: "row-nowrap", justifyContent: "center"}}>
                        {sort === false ? (
                          <>
                            <Typography variant="h2" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>Low to High</Typography>
                            <img className="hover" onClick={toggleSort} src={SortIcon} alt="switch sort icon" style={{height: "30px", width: "30px", marginTop: "3.5%", marginLeft: "1.2%"}} />
                          </>
                        ) : (
                          <>
                            <Typography variant="h2" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>High to Low</Typography>
                            <img className="hover" onClick={toggleSort} src={SortIcon} alt="switch sort icon" style={{height: "30px", width: "30px", marginTop: "3.5%", marginLeft: "1.2%"}} />
                          </>
                        )}
                      </Box>
                          {sort === false ? (
                            <>
                            {trapListingsFinalAsc.map((listing) => (
                                <Box>
                                <Paper style={{background: "transparent", border: "1px solid #ebc50c", width: "75%", display: "flex", flexFlow: "row nowrap", justifyContent: "space-evenly", margin: "0 auto", marginBottom: "2%", paddingTop: "2%", paddingBottom: "2%"}}>
                                  <Typography variant="h4" color="textPrimary">Price {ethers.utils.formatUnits(`${listing.price}`, 9)} 🧀</Typography>
                                  <Typography variant="h4" color="textPrimary">Owner: {shorten(`${listing.admin}`)}</Typography>
                                  <Typography variant="h4" color="textPrimary">Qty: {listing.amount}</Typography>
                                  <img src={PurchaseIcon} className="hover" onClick={() => {setTrapPurchaseOrder(`${listing.offerId}`), toggleTrapModal(), setTotal(`${listing.price}`), setFrom(`${listing.admin}`), setAvailable(`${listing.amount}`)}} alt="shop now icon" style={{width: "30px", height: "30px", paddingBottom: ".1%"}} />
                                </Paper>
                              </Box>
                              ))}
                            </>
                          ) : (
                            <>
                            {trapListingsFinalDsc.map((listing) => (
                                <Box>
                                <Paper style={{background: "transparent", border: "1px solid #ebc50c", width: "75%", display: "flex", flexFlow: "row nowrap", justifyContent: "space-evenly", margin: "0 auto", marginBottom: "2%", paddingTop: "2%", paddingBottom: "2%"}}>
                                  <Typography variant="h4" color="textPrimary">Price {ethers.utils.formatUnits(`${listing.price}`, 9)} 🧀</Typography>
                                  <Typography variant="h4" color="textPrimary">Owner: {shorten(`${listing.admin}`)}</Typography>
                                  <Typography variant="h4" color="textPrimary">Qty: {listing.amount}</Typography>
                                  <img src={PurchaseIcon} className="hover" onClick={() => {setTrapPurchaseOrder(`${listing.offerId}`), toggleTrapModal(), setTotal(`${listing.price}`), setFrom(`${listing.admin}`), setAvailable(`${listing.amount}`)}} alt="shop now icon" style={{width: "30px", height: "30px", paddingBottom: ".1%"}} />
                                </Paper>
                              </Box>
                              ))}
                            </>
                          )}
                    </Paper>
                  </Box>
                </Box>
              </Modal>
            </div>
          </Paper>
          </Grid>
          <Grid item md={6} lg={3}>
          <Paper className="hover" style={{display: "flex", flexDirection: "column", justifyContent: "center", background: "transparent", border: "1px solid #3ce8a6"}}>
            <div style={{display: "flex", justifyContent: "center", marginRight: "5%"}}>
              <img src={CheezPassGif} alt="mouse trap mouse pixelated" style={{height: "60px", height: "60px", padding: "3px"}} />
            </div>
            <div style={{width: "80%", display: "flex", justifyContent: "center"}}>
              <Button
                variant="outlined"
                color="primary"
                style={{marginLeft: "25%", marginBottom: "10%", marginTop: "5%"}}
                onClick={() => {setPassOpen(true)}}
                disabled={mousePurchaseOrder != null || catPurchaseOrder != null || trapPurchaseOrder != null}
              >
                View Listings
              </Button>
              <Modal
                open={passOpen}
                onClose={() => {setPassOpen(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{overflow: 'scroll'}}
              >
                <Box>
                  <Box style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <Paper>
                      <Box style={{display: "flex", justifyContent: "flex-end", marginRight: "5%", paddingTop: "2%"}}>
                        <img className="hover" onClick={() => {setPassOpen(false)}} src={CloseIcon} alt="close icon" style={{height: "15px", width: "15px"}} />
                      </Box>
                      <Typography variant="h2" style={{color: "#1ceb91", textAlign: "center", paddingTop: "2%", marginTop: "1%", marginBottom: "2%"}}>Current Cheez Pass Listings</Typography>
                      <Box style={{display: "flex", flexFlow: "row-nowrap", justifyContent: "center"}}>
                        {sort === false ? (
                          <>
                            <Typography variant="h2" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>Low to High</Typography>
                            <img className="hover" onClick={toggleSort} src={SortIcon} alt="switch sort icon" style={{height: "30px", width: "30px", marginTop: "3.5%", marginLeft: "1.2%"}} />
                          </>
                        ) : (
                          <>
                            <Typography variant="h2" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>High to Low</Typography>
                            <img className="hover" onClick={toggleSort} src={SortIcon} alt="switch sort icon" style={{height: "30px", width: "30px", marginTop: "3.5%", marginLeft: "1.2%"}} />
                          </>
                        )}
                      </Box>
                      {sort === false ? (
                        <>
                      {passListingsFinalAsc.map((listing) => (
                        <Box>
                        <Paper style={{background: "transparent", border: "1px solid #ebc50c", width: "75%", display: "flex", flexFlow: "row nowrap", justifyContent: "space-evenly", margin: "0 auto", marginBottom: "2%", paddingTop: "2%", paddingBottom: "2%"}}>
                          <Typography variant="h4" color="textPrimary">Price {ethers.utils.formatUnits(`${listing.price}`, 9)} 🧀</Typography>
                          <Typography variant="h4" color="textPrimary">Owner: {shorten(`${listing.admin}`)}</Typography>
                          <Typography variant="h4" color="textPrimary">Qty: {listing.amount}</Typography>
                          <img src={PurchaseIcon} className="hover" onClick={() => {setPassPurchaseOrder(`${listing.offerId}`), togglePassModal(), setAmount(`${listing.amount}`), setTotal(`${listing.price}`), setFrom(`${listing.admin}`), setAvailable(`${listing.amount}`)}} alt="shop now icon" style={{width: "30px", height: "30px", paddingBottom: ".1%"}} />
                        </Paper>
                      </Box>
                      ))}
                      </>
                      ) : (
                        <>
                        {passListingsFinalDsc.map((listing) => (
                          <Box>
                          <Paper style={{background: "transparent", border: "1px solid #ebc50c", width: "75%", display: "flex", flexFlow: "row nowrap", justifyContent: "space-evenly", margin: "0 auto", marginBottom: "2%", paddingTop: "2%", paddingBottom: "2%"}}>
                            <Typography variant="h4" color="textPrimary">Price {ethers.utils.formatUnits(`${listing.price}`, 9)} 🧀</Typography>
                            <Typography variant="h4" color="textPrimary">Owner: {shorten(`${listing.admin}`)}</Typography>
                            <Typography variant="h4" color="textPrimary">Qty: {listing.amount}</Typography>
                            <img src={PurchaseIcon} className="hover" onClick={() => {setPassPurchaseOrder(`${listing.offerId}`), togglePassModal(), setAmount(`${listing.amount}`), setTotal(`${listing.price}`), setFrom(`${listing.admin}`), setAvailable(`${listing.amount}`)}} alt="shop now icon" style={{width: "30px", height: "30px", paddingBottom: ".1%"}} />
                          </Paper>
                        </Box>
                        ))}
                        </>
                      )}
                    </Paper>
                  </Box>
                </Box>
              </Modal>
            </div>
          </Paper>
          </Grid>
        </Grid>
        <Box>
          {passPurchaseOrder != null ? (
            <Box style={{display: "flex", flexDirection: "column"}}>
              <Box style={{marginTop: "2%", marginBottom: "2%", display: "flex", justifyContent: "center"}}>
                <Typography variant="h4" color="textPrimary" style={{color: "3ce8a6"}}>Preview Order</Typography>
              </Box>
              <Box style={{display: "flex", justifyContent: "space-evenly"}}>
                <Box>
                  <Typography variant="h4" color="textPrimary" style={{marginTop: "1%", textAlign: "center"}}>From</Typography>
                  <Typography variant="h5" color="textSecondary" style={{textAlign: "center"}}>{shorten(from)}</Typography>
                  <Typography variant="h4" color="textPrimary" style={{marginTop: "1%", textAlign: "center"}}>To</Typography>
                  <Typography variant="h5" color="textSecondary" style={{textAlign: "center"}}>{shorten(address)} (You)</Typography>
                </Box>

                <Box>
                  <Typography variant="h4" color="textPrimary" style={{marginTop: "2%", textAlign: "center"}}>Amount</Typography>
                  <Typography variant="h5" color="textSecondary" style={{marginTop: "1.25%", textAlign: "center"}}>{amount} {amount > 1 ? 'Mice' : 'Mouse'}</Typography>
                  <Typography variant="h4" color="textPrimary" style={{marginTop: "2%", textAlign: "center"}}>Total</Typography>
                  <Typography variant="h5" color="textSecondary" style={{marginTop: "1.25%", textAlign: "center"}}>{parseInt(ethers.utils.formatUnits(`${total}`, 9) * amount)} 🧀 (CHEEZ)</Typography>
                </Box>

                <Box style={{display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "2%"}}>
                <TextField
                      id="filled-number"
                      label={`Available: ${available}`}
                      type="number"
                      value={amount}
                      style={{marginBottom: "3%"}}
                      onChange={(e) => {setAmount(e.target.value)}}
                      inputProps={{ style: { textAlign: "center" } }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      style={{width: "200px"}}
                    />
                    {approvalStatus === false ? (
                    <Button
                    variant="outlined"
                    color="primary"
                    style={{marginTop: "5%"}}
                    onClick={onSeekApproval}
                  >
                    Approve
                  </Button>
                  ) : (
                    <Button
                    variant="outlined"
                    color="primary"
                    style={{marginTop: "5%"}}
                    disabled={isPendingTxn(pendingTransactions, "buy_nft")}
                    onClick={onBuy}
                  >
                    Confirm
                  </Button>
                  )}
                  <div>
                    <Typography className="hover" onClick={() => {setPassPurchaseOrder(null), setAmount(null), setTotal(null), setFrom(null), setAvailable(null)}} variant="body1" color="textPrimary" style={{marginTop: "5%", textAlign: "center"}}>Cancel</Typography>
                  </div>
                </Box>

              </Box>
            </Box>
          ) : (
            <></>
          )}
          {mousePurchaseOrder != null ? (
            <Box style={{display: "flex", flexDirection: "column"}}>
              <Box style={{marginTop: "2%", marginBottom: "2%", display: "flex", justifyContent: "center"}}>
                <Typography variant="h4" color="textPrimary" style={{color: "3ce8a6"}}>Preview Order</Typography>
              </Box>
              <Box style={{display: "flex", justifyContent: "space-evenly"}}>
                <Box>
                  <Typography variant="h4" color="textPrimary" style={{marginTop: "1%", textAlign: "center"}}>From</Typography>
                  <Typography variant="h5" color="textSecondary" style={{textAlign: "center"}}>{shorten(from)}</Typography>
                  <Typography variant="h4" color="textPrimary" style={{marginTop: "1%", textAlign: "center"}}>To</Typography>
                  <Typography variant="h5" color="textSecondary" style={{textAlign: "center"}}>{shorten(address)} (You)</Typography>
                </Box>

                <Box>
                  <Typography variant="h4" color="textPrimary" style={{marginTop: "2%", textAlign: "center"}}>Amount</Typography>
                  <Typography variant="h5" color="textSecondary" style={{marginTop: "1.25%", textAlign: "center"}}>{amount} {amount > 1 ? 'Cats' : 'Cat'}</Typography>
                  <Typography variant="h4" color="textPrimary" style={{marginTop: "2%", textAlign: "center"}}>Total</Typography>
                  <Typography variant="h5" color="textSecondary" style={{marginTop: "1.25%", textAlign: "center"}}>{parseInt(ethers.utils.formatUnits(`${total}`, 9) * amount)} 🧀 (CHEEZ)</Typography>
                </Box>

                <Box style={{display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "2%"}}>
                <TextField
                      id="filled-number"
                      label={`Available: ${available}`}
                      type="number"
                      value={amount}
                      style={{marginBottom: "3%"}}
                      onChange={(e) => {setAmount(e.target.value)}}
                      inputProps={{ style: { textAlign: "center" } }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      style={{width: "200px"}}
                    />
                    {approvalStatus === false ? (
                    <Button
                    variant="outlined"
                    color="primary"
                    style={{marginTop: "5%"}}
                    onClick={onSeekApproval}
                  >
                    Approve
                  </Button>
                  ) : (
                    <Button
                    variant="outlined"
                    color="primary"
                    style={{marginTop: "5%"}}
                    onClick={onBuy}
                  >
                    Confirm
                  </Button>
                  )}
                  <div>
                    <Typography className="hover" onClick={() => {setMousePurchaseOrder(null), setAmount(null), setTotal(null), setFrom(null), setAvailable(null)}} variant="body1" color="textPrimary" style={{marginTop: "5%", textAlign: "center"}}>Cancel</Typography>
                  </div>
                </Box>

              </Box>
            </Box>
          ) : (
            <></>
          )}
          {catPurchaseOrder != null ? (
            <Box style={{display: "flex", flexDirection: "column"}}>
              <Box style={{marginTop: "2%", marginBottom: "2%", display: "flex", justifyContent: "center"}}>
                <Typography variant="h4" color="textPrimary" style={{color: "3ce8a6"}}>Preview Order</Typography>
              </Box>
              <Box style={{display: "flex", justifyContent: "space-evenly"}}>
                <Box>
                  <Typography variant="h4" color="textPrimary" style={{marginTop: "1%", textAlign: "center"}}>From</Typography>
                  <Typography variant="h5" color="textSecondary" style={{textAlign: "center"}}>{shorten(from)}</Typography>
                  <Typography variant="h4" color="textPrimary" style={{marginTop: "1%", textAlign: "center"}}>To</Typography>
                  <Typography variant="h5" color="textSecondary" style={{textAlign: "center"}}>{shorten(address)} (You)</Typography>
                </Box>

                <Box>
                  <Typography variant="h4" color="textPrimary" style={{marginTop: "2%", textAlign: "center"}}>Amount</Typography>
                  <Typography variant="h5" color="textSecondary" style={{marginTop: "1.25%", textAlign: "center"}}>{amount} {amount > 1 ? 'Cats' : 'Cat'}</Typography>
                  <Typography variant="h4" color="textPrimary" style={{marginTop: "2%", textAlign: "center"}}>Total</Typography>
                  <Typography variant="h5" color="textSecondary" style={{marginTop: "1.25%", textAlign: "center"}}>{parseInt(ethers.utils.formatUnits(`${total}`, 9) * amount)} 🧀 (CHEEZ)</Typography>
                </Box>

                <Box style={{display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "2%"}}>
                <TextField
                      id="filled-number"
                      label={`Available: ${available}`}
                      type="number"
                      value={amount}
                      style={{marginBottom: "3%"}}
                      onChange={(e) => {setAmount(e.target.value)}}
                      inputProps={{ style: { textAlign: "center" } }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      style={{width: "200px"}}
                    />
                    {approvalStatus === false ? (
                    <Button
                    variant="outlined"
                    color="primary"
                    style={{marginTop: "5%"}}
                    onClick={onSeekApproval}
                  >
                    Approve
                  </Button>
                  ) : (
                    <Button
                    variant="outlined"
                    color="primary"
                    style={{marginTop: "5%"}}
                    onClick={onBuy}
                  >
                    Confirm
                  </Button>
                  )}
                  <div>
                    <Typography className="hover" onClick={() => {setCatPurchaseOrder(null), setAmount(null), setTotal(null), setFrom(null), setAvailable(null)}} variant="body1" color="textPrimary" style={{marginTop: "5%", textAlign: "center"}}>Cancel</Typography>
                  </div>
                </Box>

              </Box>
            </Box>
          ) : (
            <></>
          )}
          {trapPurchaseOrder != null ? (
            <Box style={{display: "flex", flexDirection: "column"}}>
              <Box style={{marginTop: "2%", marginBottom: "2%", display: "flex", justifyContent: "center"}}>
                <Typography variant="h4" color="textPrimary" style={{color: "3ce8a6"}}>Preview Order</Typography>
              </Box>
              <Box style={{display: "flex", justifyContent: "space-evenly"}}>
                <Box>
                  <Typography variant="h4" color="textPrimary" style={{marginTop: "1%", textAlign: "center"}}>From</Typography>
                  <Typography variant="h5" color="textSecondary" style={{textAlign: "center"}}>{shorten(from)}</Typography>
                  <Typography variant="h4" color="textPrimary" style={{marginTop: "1%", textAlign: "center"}}>To</Typography>
                  <Typography variant="h5" color="textSecondary" style={{textAlign: "center"}}>{shorten(address)} (You)</Typography>
                </Box>

                <Box>
                  <Typography variant="h4" color="textPrimary" style={{marginTop: "2%", textAlign: "center"}}>Amount</Typography>
                  <Typography variant="h5" color="textSecondary" style={{marginTop: "1.25%", textAlign: "center"}}>{amount} {amount > 1 ? 'Traps' : 'Trap'}</Typography>
                  <Typography variant="h4" color="textPrimary" style={{marginTop: "2%", textAlign: "center"}}>Total</Typography>
                  <Typography variant="h5" color="textSecondary" style={{marginTop: "1.25%", textAlign: "center"}}>{parseInt(ethers.utils.formatUnits(`${total}`, 9) * amount)} 🧀 (CHEEZ)</Typography>
                </Box>

                <Box style={{display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "2%"}}>
                <TextField
                      id="filled-number"
                      label={`Available: ${available}`}
                      type="number"
                      value={amount}
                      style={{marginBottom: "3%"}}
                      onChange={(e) => {setAmount(e.target.value)}}
                      inputProps={{ style: { textAlign: "center" } }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      style={{width: "200px"}}
                    />
                    {approvalStatus === false ? (
                    <Button
                    variant="outlined"
                    color="primary"
                    style={{marginTop: "5%"}}
                    onClick={onSeekApproval}
                  >
                    Approve
                  </Button>
                  ) : (
                    <Button
                    variant="outlined"
                    color="primary"
                    style={{marginTop: "5%"}}
                    onClick={onBuy}
                  >
                    Confirm
                  </Button>
                  )}
                  <div>
                    <Typography className="hover" onClick={() => {setTrapPurchaseOrder(null), setAmount(null), setTotal(null), setFrom(null), setAvailable(null)}} variant="body1" color="textPrimary" style={{marginTop: "5%", textAlign: "center"}}>Cancel</Typography>
                  </div>
                </Box>

              </Box>
            </Box>
          ) : (
            <></>
          )}
        </Box>

        {/* <Paper style={{border: "1px solid #ebc50c", background: "transparent", height: "40px", marginTop: "2%", marginBottom: "2%"}}>
        <Typography variant="h5" color="textSecondary" style={{textAlign: "center", marginTop: ".5%"}}>Highest Sale: {highestSale != null || undefined ? '' : <Skeleton type="text" width="30px" style={{margin: "0 auto"}} />} Cats for {highestSale != null || undefined ? `${ethers.utils.formatUnits(`${highestSale.price}`, 9)}` : ''} 🧀</Typography>
        </Paper> */}
        <Box style={{display: "flex", justifyContent: "center", marginTop: "2%"}}>
          <Paper style={{border: "1px solid #ebc50c", background: "transparent", marginTop: "2%", marginBottom: "2%", width: "80%"}}>
            <Typography variant="h3" color="textPrimary" style={{textAlign: "center", marginBottom: "1%", marginTop: "1%"}}>Recent Sales</Typography>
          </Paper>
        </Box>
        <Grid container spacing={2} style={{margin: "0 auto", marginTop: "1%", justifyContent: "center"}}>
            {sales.slice(0,24).map((listing) => (
              <Grid item md={5} lg={3}>
                <Paper style={{paddingBottom: "3%", background: "rgba(27, 130, 84, .4)", border: "1px solid #3ce8a6"}}>
                <Typography variant="h4" color="textSecondary" style={{textAlign: "center", paddingTop: "5%"}}><span style={{color: "#FFFFFF"}}>Total:</span> {parseFloat(ethers.utils.formatUnits(`${listing.price}`, 9)).toFixed(3)} 🧀 </Typography>
                <Divider variant="middle" style={{marginTop: "2%", background: "#3ce8a6"}} />
                <Typography variant="h5" color="textPrimary" style={{textAlign: "center", paddingTop: "5%", paddingLeft: "1%", paddingRight: "1%"}}><span style={{color: "#ebc50c"}}>{shorten(`${listing.admin}`)}</span> <br /> bought <span style={{color: "#ebc50c"}}>{listing.amount}</span> 
                {listing ? (
                  <Box style={{marginTop: "1.75%"}}>{listing.tokenId === 0 && listing.amount > 1 && listing.token === addresses[chainID].NFT_CONTRACT_ADDRESS ? <img src={Mouse} alt="mouse icon" style={{height: "60px", width: "60px"}} /> : listing.tokenId === 0 && listing.amount === 1 && listing.token === addresses[chainID].NFT_CONTRACT_ADDRESS ? <img src={Mouse} alt="mouse icon" style={{height: "60px", width: "60px"}} /> : listing.tokenId === 1 && listing.amount > 1 ? <img src={Cat} alt="cat icon" style={{height: "60px", width: "60px"}} /> : listing.tokenId === 1 && listing.amount <= 1 ? <img src={Cat} alt="cat icon" style={{height: "60px", width: "60px"}} /> : listing.tokenId === 2 && listing.amount > 1 ? <img src={MouseTrap} alt="mouse trap icon" style={{height: "60px", width: "60px"}} /> : listing.tokenId === 2 ? <img src={MouseTrap} alt="mouse trap icon" style={{height: "60px", width: "60px"}} /> : listing.token === addresses[chainID].CHEEZPASS_CONTRACT_ADDRESS ? <img src={CheezPassGif} alt="cheesepass spinning gif" style={{height: "60px", width: "60px"}} /> : ''}</Box>
                ) : (
                  <></>
                )} 
                 for {(parseFloat(ethers.utils.formatUnits(`${listing.price}`, 9))/listing.amount).toFixed(2)} 🧀 {listing.amount > 1 ? "each!" : ""}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          </Container>
    </div>
  );
}

export default Activity;
