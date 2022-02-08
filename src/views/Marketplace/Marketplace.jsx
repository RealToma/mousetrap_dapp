import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom'
import { Paper, Button, Grid, Typography, TextField, Box, Zoom, Container, useMediaQuery, Modal, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { shorten } from "../../helpers";
import {ethers} from "ethers";
import { useWeb3Context } from "src/hooks/web3Context";

import { useSelector, useDispatch, useAppSelector } from "react-redux";
import { loadAccountDetails } from "../../slices/AccountSlice";
import { getListings } from "../../slices/ListingSlice";
import { BuyListing, changeApproval } from "../../slices/BuySlice";
import { getListingsDsc } from "../../slices/ListingSliceDsc";
import { getCatListings } from "../../slices/CatListingSlice";
import { getCatListingsDsc } from "../../slices/CatListingSliceDsc";
import { getTrapListings } from "../../slices/TrapListingSlice";
import { getTrapListingsDsc } from "../../slices/TrapListingSliceDsc";

import Mouse from "./mouse.png";
import Cat from "./catlogo.png";
import MouseTrap from "./mousetrap.png";
import SortIcon from "./sort.png";
import PurchaseIcon from "./shop.png";
import CloseIcon from "./close.png";

import "./dashboard.scss";

function Marketplace() {

    const { provider, address, chainID } = useWeb3Context();

    const smallerScreen = useMediaQuery("(max-width: 650px)");
    const verySmallScreen = useMediaQuery("(max-width: 379px)");
    const [catOpen, setCatOpen] = useState(false);
    const [mouseOpen, setMouseOpen] = useState(false);
    const [trapOpen, setTrapOpen] = useState(false);
    const [sort, setSort] = useState(false);
    const [mousePurchaseOrder, setMousePurchaseOrder] = useState(null);
    const [catPurchaseOrder, setCatPurchaseOrder] = useState(null);
    const [trapPurchaseOrder, setTrapPurchaseOrder] = useState(null);
    const [mouseListingsFinalAsc, setmouseListingsFinalAsc] = useState([]);
    const [catListingsFinalAsc, setcatListingsFinalAsc] = useState([]);
    const [trapListingsFinalAsc, settrapListingsFinalAsc] = useState([]);
    const [mouseListingsFinalDsc, setmouseListingsFinalDsc] = useState([]);
    const [catListingsFinalDsc, setcatListingsFinalDsc] = useState([]);
    const [trapListingsFinalDsc, settrapListingsFinalDsc] = useState([]);
    const [approvalStatus, setApprovalStatus] = useState(false);
    const [offerID, setOfferID] = useState(null);
    const accountDetails = useSelector(state => state.account)
    const { item } = useParams()  

    useEffect(() => {
      if(item){
        let it = item.toLowerCase()
        if(it == "mouse" || it == "mice"){
          setMouseOpen(true)
          setCatOpen(false)
          setTrapOpen(false)
        } else if(it == "cat" || it == "cats"){
          setMouseOpen(false)
          setCatOpen(true)
          setTrapOpen(false)
        } else if(it == "traps" || it == "trap" || it == "mousetraps" || it == "mousetrap"){
          setMouseOpen(false)
          setCatOpen(false)
          setTrapOpen(true)
        }  
      }
    }, [item])
  
    useEffect(() => {
      dispatch(loadAccountDetails({ networkID: chainID, address, provider: provider }))
      if(approvalStatus === false) {
        if(accountDetails.minting) {
          setApprovalStatus(accountDetails.minting.marketplaceCheezAllowance.gte(ethers.utils.parseUnits("1000", 9)))
        }
      }
    }, [loadAccountDetails, accountDetails.minting, approvalStatus])

    useEffect(() => {
      if(mousePurchaseOrder) {
        setOfferID(mousePurchaseOrder)
      } else if(catPurchaseOrder) {
        setOfferID(catPurchaseOrder)
      } else if(trapPurchaseOrder) {
        setOfferID(trapPurchaseOrder)
      }
    }, [mousePurchaseOrder, catPurchaseOrder, trapPurchaseOrder])

    //Preview
    const [amount, setAmount] = useState(1);
    const [from, setFrom] = useState(null);
    const [total, setTotal] = useState(null);
    const [available, setAvailable] = useState(1);
    const [mouseFloor, setMouseFloor] = useState(null);
    const [catFloor, setCatFloor] = useState(null);
    const [trapFloor, setTrapFloor] = useState(null);
    const [loaded, setLoaded] = useState(false);


    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(getListings()),
      dispatch(getListingsDsc()),
      dispatch(getCatListings()),
      dispatch(getCatListingsDsc()),
      dispatch(getTrapListings()),
      dispatch(getTrapListingsDsc())
    }, [dispatch])

    const onSeekApproval = async token => {
      await dispatch(changeApproval({ address, provider, networkID: chainID }));
    };

    const onBuy = async () => {
      await dispatch(BuyListing({ provider, amount, address, offerID }));
    };

    const mouseListings = useSelector(state => state.listings)
    const catListings = useSelector(state => state.catListings)
    const trapListings = useSelector(state => state.trapListings)
    const mouseListingsDsc = useSelector(state => state.listingsDsc)
    const catListingsDsc = useSelector(state => state.catListingsDsc)
    const trapListingsDsc = useSelector(state => state.trapListingsDsc)

    useEffect(() => {
      let arr = []
      Object.keys(mouseListings).forEach((key) => {
        arr.push(mouseListings[key])
      })
      setmouseListingsFinalAsc(arr)

      arr = []
      Object.keys(mouseListingsDsc).forEach((key) => {
        arr.push(mouseListingsDsc[key])
      })
      setmouseListingsFinalDsc(arr)

      arr = []
      Object.keys(catListings).forEach((key) => {
        arr.push(catListings[key])
      })
      setcatListingsFinalAsc(arr)

      arr = []
      Object.keys(catListingsDsc).forEach((key) => {
        arr.push(catListingsDsc[key])
      })
      setcatListingsFinalDsc(arr)

      arr = []
      Object.keys(trapListings).forEach((key) => {
        arr.push(trapListings[key])
      })
      settrapListingsFinalAsc(arr)

      arr = []
      Object.keys(trapListingsDsc).forEach((key) => {
        arr.push(trapListingsDsc[key])
      })
      settrapListingsFinalDsc(arr)
  }, [mouseListings, mouseListingsDsc, catListings, catListingsDsc, trapListings, trapListingsDsc])

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
    }) 

    const toggleMouseModal = () => {
      setMouseOpen(!mouseOpen)
    }

    const toggleCatModal = () => {
      setCatOpen(!catOpen)
    }

    const toggleTrapModal = () => {
      setTrapOpen(!trapOpen)
    }

    const toggleSort = () => {
      setSort(!sort)
    }


  return (
    <div id="treasury-dashboard-view" className={`${smallerScreen && "smaller"} ${verySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? "0" : "3.3rem",
          paddingRight: smallerScreen || verySmallScreen ? "0" : "3.3rem",
        }}
      >
        <Paper style={{ marginBottom: "3%"}}>
        <Typography variant="h2" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>Marketplace</Typography>
        </Paper>
        <Grid container spacing={4} justifyContent="center">
          <Grid item md={6} lg={4}>
            <Paper style={{display: "flex", flexDirection: "row", justifyContent: "space-between", background: "transparent", border: "1px solid #3ce8a6"}}>
            <Typography variant="h5" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "4%", marginBottom: "2%", marginLeft: "5%"}}>Floor:</Typography>
              <Typography variant="h3" color="textPrimary" style={{textAlign: "center", paddingTop: "1%", paddingBottom: "2%", marginTop: "5%", marginBottom: "2%", marginLeft: "2%"}}>{mouseFloor != null || undefined ? `${ethers.utils.formatUnits(`${mouseFloor.price}`, 9)}` : ''} 🧀</Typography>
              <div style={{display: "flex", justifyContent: "center"}}>
                <img src={Mouse} alt="mouse trap mouse pixelated" style={{height: "60px", height: "60px", marginRight: "5%"}} />
              </div>
            </Paper>
          </Grid>
          <Grid item md={6} lg={4}>
            <Paper style={{display: "flex", flexDirection: "row", justifyContent: "space-between", background: "transparent", border: "1px solid #3ce8a6"}}>
            <Typography variant="h5" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "4%", marginBottom: "2%", marginLeft: "5%"}}>Floor:</Typography>
              <Typography variant="h3" color="textPrimary" style={{textAlign: "center", paddingTop: "1%", paddingBottom: "2%", marginTop: "5%", marginBottom: "2%", marginLeft: "2%"}}>{catFloor != null || undefined ? `${ethers.utils.formatUnits(`${catFloor.price}`, 9)}` : ''} 🧀</Typography>
              <div style={{display: "flex", justifyContent: "center"}}>
                <img src={Cat} alt="mouse trap cat pixelated" style={{height: "60px", height: "60px", marginRight: "5%"}} />
              </div>
            </Paper>
          </Grid>
          <Grid item md={6} lg={4}>
            <Paper style={{display: "flex", flexDirection: "row", justifyContent: "space-between", background: "transparent", border: "1px solid #3ce8a6"}}>
            <Typography variant="h5" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "4%", marginBottom: "2%", marginLeft: "5%"}}>Floor:</Typography>
              <Typography variant="h3" color="textPrimary" style={{textAlign: "center", paddingTop: "1%", paddingBottom: "2%", marginTop: "5%", marginBottom: "2%", marginLeft: "2%"}}>{trapFloor != null || undefined ? `${ethers.utils.formatUnits(`${trapFloor.price}`, 9)}` : ''} 🧀</Typography>
              <div style={{display: "flex", justifyContent: "center"}}>
                <img src={MouseTrap} alt="mouse trap mousetrap pixelated" style={{height: "60px", height: "60px", marginRight: "5%"}} />
              </div>
            </Paper>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" spacing={4}>
          <Grid item md={6} lg={4}>
            {mousePurchaseOrder === null || undefined ? (
            <Paper style={{maxWidth: '100%'}}>
            <Typography variant="h3" color="textPrimary" style={{paddingTop: "5%", textAlign: "center"}}>Adopt Mice</Typography>
            <div style={{display: "flex", justifyContent: "center"}}>
              <img src={Mouse} alt="mouse pixel art" style={{ height: "230px", width: "230px"}} />
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
            ) : (
              <Paper>
                <Box style={{display: "flex", justifyContent: "flex-end", marginRight: "5%", paddingTop: "2%"}}>
                  <img className="hover" onClick={() => {setMousePurchaseOrder(null), setAmount(null), setTotal(null), setFrom(null), setAvailable(null)}} src={CloseIcon} alt="close icon" style={{height: "15px", width: "15px"}} />
                </Box>
                <Typography variant="h3" color="textPrimary" style={{ textAlign: "center"}}>Preview Order</Typography>
                <Typography variant="h4" color="textPrimary" style={{paddingTop: "5%", textAlign: "center"}}>From</Typography>
                <Typography variant="h5" color="textSecondary" style={{paddingTop: "2%", textAlign: "center"}}>{shorten(from)}</Typography>
                <Typography variant="h4" color="textPrimary" style={{paddingTop: "5%", textAlign: "center"}}>To</Typography>
                <Typography variant="h5" color="textSecondary" style={{paddingTop: "2%", textAlign: "center"}}>{shorten(address)} (You)</Typography>
                <Typography variant="h4" color="textPrimary" style={{paddingTop: "5%", textAlign: "center"}}>Amount</Typography>
                <Typography variant="h5" color="textSecondary" style={{paddingTop: "2%", textAlign: "center"}}>{amount} Mice</Typography>
                <Typography variant="h4" color="textPrimary" style={{paddingTop: "5%", textAlign: "center"}}>Total</Typography>
                <Typography variant="h5" color="textSecondary" style={{paddingTop: "2%", textAlign: "center"}}>{parseInt(ethers.utils.formatUnits(`${total}`, 9) * amount)} 🧀 (CHEEZ)</Typography>
                <Box style={{display: "flex", justifyContent: "center", marginTop: "2%"}}>
                <TextField
                      id="filled-number"
                      label={`Max Available: ${available}`}
                      type="number"
                      value={amount}
                      onChange={(e) => {setAmount(e.target.value)}}
                      InputProps={{ inputProps: { min: 0, max: 20 } }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{width: "200px"}}
                      variant="outlined"
                    />
                </Box>
                <Box style={{display: "flex", justifyContent: "center", marginTop: "5%", marginBottom: "5%"}}>
                  {approvalStatus === false ? (
                    <Button
                    variant="outlined"
                    color="primary"
                    style={{marginBottom: "8%"}}
                    onClick={onSeekApproval}
                  >
                    Approve
                  </Button>
                  ) : (
                    <Button
                    variant="outlined"
                    color="primary"
                    style={{marginBottom: "8%"}}
                    onClick={onBuy}
                  >
                    Confirm
                  </Button>
                  )}
                </Box>
              </Paper>
            )}
          </Grid>
          <Grid item md={6} lg={4}>
            {(catPurchaseOrder === null || undefined) ? (
            <Paper style={{maxWidth: '100%'}}>
            <Typography variant="h3" color="textPrimary" style={{paddingTop: "5%", textAlign: "center"}}>Adopt Cats</Typography>
            <div style={{display: "flex", justifyContent: "center"}}>
              <img src={Cat} alt="cat pixel art" style={{height: "230px", width: "230px"}} />
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
            ) : (
              <Paper>
                <Box style={{display: "flex", justifyContent: "flex-end", marginRight: "5%", paddingTop: "2%"}}>
                  <img className="hover" onClick={() => {setCatPurchaseOrder(null), setAmount(null), setTotal(null), setFrom(null), setAvailable(null)}} src={CloseIcon} alt="close icon" style={{height: "15px", width: "15px"}} />
                </Box>
                <Typography variant="h3" color="textPrimary" style={{ textAlign: "center"}}>Preview Order</Typography>
                <Typography variant="h4" color="textPrimary" style={{paddingTop: "5%", textAlign: "center"}}>From</Typography>
                <Typography variant="h5" color="textSecondary" style={{paddingTop: "2%", textAlign: "center"}}>{shorten(from)}</Typography>
                <Typography variant="h4" color="textPrimary" style={{paddingTop: "5%", textAlign: "center"}}>To</Typography>
                <Typography variant="h5" color="textSecondary" style={{paddingTop: "2%", textAlign: "center"}}>{shorten(address)} (You)</Typography>
                <Typography variant="h4" color="textPrimary" style={{paddingTop: "5%", textAlign: "center"}}>Amount</Typography>
                <Typography variant="h5" color="textSecondary" style={{paddingTop: "2%", textAlign: "center"}}>{amount} {amount > 1 ? 'Cats' : 'Cat'}</Typography>
                <Typography variant="h4" color="textPrimary" style={{paddingTop: "5%", textAlign: "center"}}>Total</Typography>
                <Typography variant="h5" color="textSecondary" style={{paddingTop: "2%", textAlign: "center"}}>{parseInt(ethers.utils.formatUnits(`${total}`, 9) * amount)} 🧀 (CHEEZ)</Typography>
                <Box style={{display: "flex", justifyContent: "center", marginTop: "2%"}}>
                <TextField
                      id="filled-number"
                      label={`Max Available: ${available}`}
                      type="number"
                      value={amount}
                      onChange={(e) => {setAmount(e.target.value)}}
                      InputProps={{ inputProps: { min: 0, max: 20 } }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      style={{width: "200px"}}
                    />
                </Box>
                <Box style={{display: "flex", justifyContent: "center", marginTop: "5%", marginBottom: "5%"}}>
                  {approvalStatus === false ? (
                    <Button
                    variant="outlined"
                    color="primary"
                    style={{marginBottom: "8%"}}
                    onClick={onSeekApproval}
                  >
                    Approve
                  </Button>
                  ) : (
                    <Button
                    variant="outlined"
                    color="primary"
                    style={{marginBottom: "8%"}}
                    onClick={onBuy}
                  >
                    Confirm
                  </Button>
                  )}
                </Box>
              </Paper>
            )}
          </Grid>

          <Grid item md={6} lg={4}>
            {trapPurchaseOrder === null || undefined ? (
            <Paper style={{maxWidth: '100%'}}>
            <Typography variant="h3" color="textPrimary" style={{paddingTop: "5%", textAlign: "center"}}>Collect MouseTraps</Typography>
            <div style={{display: "flex", justifyContent: "center"}}>
              <img src={MouseTrap} alt="mousetrap pixel art" style={{ height: "230px", width: "230px"}} />
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
            ) : (
              <Paper>
                <Box style={{display: "flex", justifyContent: "flex-end", marginRight: "5%", paddingTop: "2%"}}>
                  <img className="hover" onClick={() => {setTrapPurchaseOrder(null), setAmount(null), setTotal(null), setFrom(null), setAvailable(null)}} src={CloseIcon} alt="close icon" style={{height: "15px", width: "15px"}} />
                </Box>
                <Typography variant="h3" color="textPrimary" style={{ textAlign: "center"}}>Preview Order</Typography>
                <Typography variant="h4" color="textPrimary" style={{paddingTop: "5%", textAlign: "center"}}>From</Typography>
                <Typography variant="h5" color="textSecondary" style={{paddingTop: "2%", textAlign: "center"}}>{shorten(from)}</Typography>
                <Typography variant="h4" color="textPrimary" style={{paddingTop: "5%", textAlign: "center"}}>To</Typography>
                <Typography variant="h5" color="textSecondary" style={{paddingTop: "2%", textAlign: "center"}}>{shorten(address)} (You)</Typography>
                <Typography variant="h4" color="textPrimary" style={{paddingTop: "5%", textAlign: "center"}}>Amount</Typography>
                <Typography variant="h5" color="textSecondary" style={{paddingTop: "2%", textAlign: "center"}}>{amount} {amount > 1 ? 'Traps' : 'Trap'}</Typography>
                <Typography variant="h4" color="textPrimary" style={{paddingTop: "5%", textAlign: "center"}}>Total</Typography>
                <Typography variant="h5" color="textSecondary" style={{paddingTop: "2%", textAlign: "center"}}>{parseInt(ethers.utils.formatUnits(`${total}`, 9) * amount)} 🧀 (CHEEZ)</Typography>
                <Box style={{display: "flex", justifyContent: "center", marginTop: "2%"}}>
                <TextField
                      id="filled-number"
                      label={`Max Available: ${available}`}
                      type="number"
                      value={amount}
                      onChange={(e) => {setAmount(e.target.value)}}
                      InputProps={{ inputProps: { min: 0, max: 20 } }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      style={{width: "200px"}}
                    />
                </Box>
                <Box style={{display: "flex", justifyContent: "center", marginTop: "5%", marginBottom: "5%"}}>
                  {approvalStatus === false ? (
                    <Button
                    variant="outlined"
                    color="primary"
                    style={{marginBottom: "8%"}}
                    onClick={onSeekApproval}
                  >
                    Approve
                  </Button>
                  ) : (
                    <Button
                    variant="outlined"
                    color="primary"
                    style={{marginBottom: "8%"}}
                    onClick={onBuy}
                  >
                    Confirm
                  </Button>
                  )}
                </Box>
              </Paper>
            )}
          </Grid>
            </Grid>

      </Container>
    </div>
  );
}

export default Marketplace;
