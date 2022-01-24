import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { shorten } from "../../helpers";
import { addresses } from "../../constants";
import { Skeleton } from "@material-ui/lab";
import {
  Box,
  Container,
  Paper,
  useMediaQuery,
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
import { Col, Row, Button, Table, Modal } from "react-bootstrap";


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
    if (item) {
      let it = item.toLowerCase()
      if (it == "mouse" || it == "mice") {
        setMouseOpen(true)
        setCatOpen(false)
        setTrapOpen(false)
        setPassOpen(false)
      } else if (it == "cat" || it == "cats") {
        setMouseOpen(false)
        setCatOpen(true)
        setTrapOpen(false)
        setPassOpen(false)
      } else if (it == "traps" || it == "trap" || it == "mousetraps" || it == "mousetrap") {
        setMouseOpen(false)
        setCatOpen(false)
        setTrapOpen(true)
        setPassOpen(false)
      } else if (it == "pass" || it == "passes") {
        setPassOpen(true)
        setMouseOpen(false)
        setCatOpen(false)
        setTrapOpen(false)
      }
    }
  }, [item])

  useEffect(() => {
    dispatch(loadAccountDetails({ networkID: chainID, address, provider: provider }))
    if (approvalStatus === false) {
      if (accountDetails.minting) {
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

  const [btnActive, setBtnActive] = useState(1);

  const [buyButtonMdal, setBuyButtonMdal] = useState(false);
  const buyButtonMdalClose = () => setBuyButtonMdal(false);
  const buyButtonMdalShow = () => setBuyButtonMdal(true);

  return (
    <>
      <div className="market-main px-3">
        <Row className="justify-content-center">
          <Col lg={3} md={6} sm={12} className="mt-3">
            <div className="floor-box d-flex align-items-center gap">
              <img src={require('./mouse-market.png').default} alt="" width={100} />
              <div className="floor-text">
                <span>Floor:</span>
                <h3>{mouseFloor != null || undefined ? `${ethers.utils.formatUnits(`${mouseFloor.price}`, 9)}` : ''} 🧀</h3>
              </div>
            </div>
          </Col>
          <Col lg={3} md={6} sm={12} className="mt-3">
            <div className="floor-box d-flex align-items-center gap">
              <img src={require('./cat.png').default} alt="" width={100} />
              <div className="floor-text">
                <span>Floor:</span>
                <h3>{catFloor != null || undefined ? `${ethers.utils.formatUnits(`${catFloor.price}`, 9)}` : ''} 🧀</h3>
              </div>
            </div>
          </Col>
          <Col lg={3} md={6} sm={12} className="mt-3">
            <div className="floor-box d-flex align-items-center gap">
              <img src={require('./mouse-trap.png').default} alt="" width={100} />
              <div className="floor-text">
                <span>Floor:</span>
                <h3>{trapFloor != null || undefined ? `${ethers.utils.formatUnits(`${trapFloor.price}`, 9)}` : ''} 🧀</h3>
              </div>
            </div>
          </Col>
          <Col lg={3} md={6} sm={12} className="mt-3">
            <div className="floor-box d-flex align-items-center gap">
              <img src={require('./card.png').default} alt="" width={100} />
              <div className="floor-text">
                <span>Floor:</span>
                <h3>{passFloor != null || undefined ? `${ethers.utils.formatUnits(`${passFloor.price}`, 9)}` : ''} 🧀</h3>
              </div>
            </div>
          </Col>
        </Row>

        <div className="main mt-5">
          <div className="main-btn-box">
            <Button className={`${btnActive === 1 ? "active" : ""}`} onClick={() => setBtnActive(1)}>
              <img src={require('./mouse-market.png').default} alt="" width={60} />
              <h4 className="mb-0">Mouse Listings</h4>
            </Button>
            <Button className={`${btnActive === 2 ? "active" : ""}`} onClick={() => setBtnActive(2)}>
              <img src={require('./cat.png').default} alt="" width={50} />
              <h4 className="mb-0">Cat Listings</h4>
            </Button>
            <Button className={`${btnActive === 3 ? "active" : ""}`} onClick={() => setBtnActive(3)}>
              <img src={require('./mouse-trap.png').default} alt="" width={50} />
              <h4 className="mb-0">MouseTrap Listings</h4>
            </Button>
            <Button className={`${btnActive === 4 ? "active" : ""}`} onClick={() => setBtnActive(4)}>
              <img src={require('./card.png').default} alt="" width={50} />
              <h4 className="mb-0">CHEEZ Pass Listings</h4>
            </Button>
          </div>

          {btnActive === 1 &&
            <>
              <div className="pagination mt-3 px-3">
                {sort === false ? (
                  <>
                    <Button className="short" onClick={toggleSort}>Low to High <img src={require('./shorting.png').default} alt="" /></Button>
                  </>
                ) : (
                  <>
                    <Button className="short" onClick={toggleSort}>High to Low <img src={require('./shorting.png').default} alt="" /></Button>
                  </>
                )}

                <div className="pagination-btns ms-auto d-flex align-items-center">
                  <Button><img src={require('./left-arrow.png').default} alt="" /></Button>
                  <Button className="pages active">1</Button>
                  <Button className="pages">2</Button>
                  <Button className="pages">3</Button>
                  <Button>...</Button>
                  <Button className="pages">5</Button>
                  <Button><img src={require('./right-arrow.png').default} alt="" /></Button>
                </div>
              </div>
              <div className="px-3">
                <Table responsive>
                  <tbody>
                    {sort === false ? (
                      <>
                        {mouseListingsFinalAsc.map((listing) => (
                          <tr>
                            <td className="no-wrap">Price {ethers.utils.formatUnits(`${listing.price}`, 9)} 🧀</td>
                            <td>
                              <div className="my-3">
                                <span>Owner:</span>
                                <p className="mb-0 bold">{shorten(`${listing.admin}`)}</p>
                              </div>
                            </td>
                            <td>
                              <div >
                                <span>Qty:</span>
                                <p className="mb-0 bold">{listing.amount}</p>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-end">
                                <Button className="by no-wrap" onClick={() => { buyButtonMdalShow(), setMousePurchaseOrder(`${listing.offerId}`), setAmount(`${listing.amount}`), setTotal(`${listing.price}`), setFrom(`${listing.admin}`), setAvailable(`${listing.amount}`) }}>Buy mouse</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <>
                        {mouseListingsFinalDsc.map((listing) => (
                          <tr>
                            <td className="no-wrap">Price {ethers.utils.formatUnits(`${listing.price}`, 9)} 🧀</td>
                            <td>
                              <div className="my-3">
                                <span>Owner:</span>
                                <p className="mb-0 bold">{shorten(`${listing.admin}`)}</p>
                              </div>
                            </td>
                            <td>
                              <div >
                                <span>Qty:</span>
                                <p className="mb-0 bold">{listing.amount}</p>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-end">
                                <Button className="by no-wrap" onClick={() => { buyButtonMdalShow(), setMousePurchaseOrder(`${listing.offerId}`), setAmount(`${listing.amount}`), setTotal(`${listing.price}`), setFrom(`${listing.admin}`), setAvailable(`${listing.amount}`) }}>Buy mouse</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </Table>
              </div>
            </>
          }

          {btnActive === 2 &&
            <>
              <div className="pagination mt-3 px-3">
                {sort === false ? (
                  <>
                    <Button className="short" onClick={toggleSort}>Low to High <img src={require('./shorting.png').default} alt="" /></Button>
                  </>
                ) : (
                  <>
                    <Button className="short" onClick={toggleSort}>High to Low <img src={require('./shorting.png').default} alt="" /></Button>
                  </>
                )}

                <div className="pagination-btns ms-auto d-flex align-items-center">
                  <Button><img src={require('./left-arrow.png').default} alt="" /></Button>
                  <Button className="pages active">1</Button>
                  <Button className="pages">2</Button>
                  <Button className="pages">3</Button>
                  <Button>...</Button>
                  <Button className="pages">5</Button>
                  <Button><img src={require('./right-arrow.png').default} alt="" /></Button>
                </div>
              </div>
              <div className="px-3">
                <Table responsive>
                  <tbody>
                    {sort === false ? (
                      <>
                        {catListingsFinalAsc.map((listing) => (
                          <tr>
                            <td className="no-wrap">Price {ethers.utils.formatUnits(`${listing.price}`, 9)} 🧀</td>
                            <td>
                              <div className="my-3">
                                <span>Owner:</span>
                                <p className="mb-0 bold">{shorten(`${listing.admin}`)}</p>
                              </div>
                            </td>
                            <td>
                              <div >
                                <span>Qty:</span>
                                <p className="mb-0 bold">{listing.amount}</p>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-end">

                                <Button className="by no-wrap" onClick={() => { buyButtonMdalShow(), setCatPurchaseOrder(`${listing.offerId}`), toggleCatModal(), setAmount(`${listing.amount}`), setTotal(`${listing.price}`), setFrom(`${listing.admin}`), setAvailable(`${listing.amount}`) }}>Buy mouse</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <>
                        {mouseListingsFinalDsc.map((listing) => (
                          <tr>
                            <td className="no-wrap">Price {ethers.utils.formatUnits(`${listing.price}`, 9)} 🧀</td>
                            <td>
                              <div className="my-3">
                                <span>Owner:</span>
                                <p className="mb-0 bold">{shorten(`${listing.admin}`)}</p>
                              </div>
                            </td>
                            <td>
                              <div >
                                <span>Qty:</span>
                                <p className="mb-0 bold">{listing.amount}</p>
                              </div>
                            </td>
                            <td>
                              <Button className="by no-wrap" onClick={() => { buyButtonMdalShow(), setCatPurchaseOrder(`${listing.offerId}`), toggleCatModal(), setAmount(`${listing.amount}`), setTotal(`${listing.price}`), setFrom(`${listing.admin}`), setAvailable(`${listing.amount}`) }}>Buy mouse</Button>
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </Table>
              </div>
            </>
          }

          {btnActive === 3 &&
            <>
              <div className="pagination mt-3 px-3">
                {sort === false ? (
                  <>
                    <Button className="short" onClick={toggleSort}>Low to High <img src={require('./shorting.png').default} alt="" /></Button>
                  </>
                ) : (
                  <>
                    <Button className="short" onClick={toggleSort}>High to Low <img src={require('./shorting.png').default} alt="" /></Button>
                  </>
                )}

                <div className="pagination-btns ms-auto d-flex align-items-center">
                  <Button><img src={require('./left-arrow.png').default} alt="" /></Button>
                  <Button className="pages active">1</Button>
                  <Button className="pages">2</Button>
                  <Button className="pages">3</Button>
                  <Button>...</Button>
                  <Button className="pages">5</Button>
                  <Button><img src={require('./right-arrow.png').default} alt="" /></Button>
                </div>
              </div>
              <div className="px-3">
                <Table responsive>
                  <tbody>
                    {sort === false ? (
                      <>
                        {trapListingsFinalAsc.map((listing) => (
                          <tr>
                            <td className="no-wrap">Price {ethers.utils.formatUnits(`${listing.price}`, 9)} 🧀</td>
                            <td>
                              <div className="my-3">
                                <span>Owner:</span>
                                <p className="mb-0 bold">{shorten(`${listing.admin}`)}</p>
                              </div>
                            </td>
                            <td>
                              <div >
                                <span>Qty:</span>
                                <p className="mb-0 bold">{listing.amount}</p>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-end">

                                <Button className="by no-wrap" onClick={() => { buyButtonMdalShow(), setTrapPurchaseOrder(`${listing.offerId}`), toggleTrapModal(), setTotal(`${listing.price}`), setFrom(`${listing.admin}`), setAvailable(`${listing.amount}`) }}>Buy mouse</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <>
                        {mouseListingsFinalDsc.map((listing) => (
                          <tr>
                            <td className="no-wrap">Price {ethers.utils.formatUnits(`${listing.price}`, 9)} 🧀</td>
                            <td>
                              <div className="my-3">
                                <span>Owner:</span>
                                <p className="mb-0 bold">{shorten(`${listing.admin}`)}</p>
                              </div>
                            </td>
                            <td>
                              <div >
                                <span>Qty:</span>
                                <p className="mb-0 bold">{listing.amount}</p>
                              </div>
                            </td>
                            <td>
                              <Button className="by no-wrap" onClick={() => { buyButtonMdalShow(), setTrapPurchaseOrder(`${listing.offerId}`), toggleTrapModal(), setTotal(`${listing.price}`), setFrom(`${listing.admin}`), setAvailable(`${listing.amount}`) }}>Buy mouse</Button>
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </Table>
              </div>
            </>
          }

          {btnActive === 4 &&
            <>
              <div className="pagination mt-3 px-3">
                {sort === false ? (
                  <>
                    <Button className="short" onClick={toggleSort}>Low to High <img src={require('./shorting.png').default} alt="" /></Button>
                  </>
                ) : (
                  <>
                    <Button className="short" onClick={toggleSort}>High to Low <img src={require('./shorting.png').default} alt="" /></Button>
                  </>
                )}

                <div className="pagination-btns ms-auto d-flex align-items-center">
                  <Button><img src={require('./left-arrow.png').default} alt="" /></Button>
                  <Button className="pages active">1</Button>
                  <Button className="pages">2</Button>
                  <Button className="pages">3</Button>
                  <Button>...</Button>
                  <Button className="pages">5</Button>
                  <Button><img src={require('./right-arrow.png').default} alt="" /></Button>
                </div>
              </div>
              <div className="px-3">
                <Table responsive>
                  <tbody>
                    {sort === false ? (
                      <>
                        {passListingsFinalAsc.map((listing) => (
                          <tr>
                            <td className="no-wrap">Price {ethers.utils.formatUnits(`${listing.price}`, 9)} 🧀</td>
                            <td>
                              <div className="my-3">
                                <span>Owner:</span>
                                <p className="mb-0 bold">{shorten(`${listing.admin}`)}</p>
                              </div>
                            </td>
                            <td>
                              <div >
                                <span>Qty:</span>
                                <p className="mb-0 bold">{listing.amount}</p>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-end">
                                <Button className="by no-wrap" onClick={() => { buyButtonMdalShow(), setPassPurchaseOrder(`${listing.offerId}`), togglePassModal(), setAmount(`${listing.amount}`), setTotal(`${listing.price}`), setFrom(`${listing.admin}`), setAvailable(`${listing.amount}`) }}>Buy mouse</Button>

                              </div>
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <>
                        {mouseListingsFinalDsc.map((listing) => (
                          <tr>
                            <td className="no-wrap">Price {ethers.utils.formatUnits(`${listing.price}`, 9)} 🧀</td>
                            <td>
                              <div className="my-3">
                                <span>Owner:</span>
                                <p className="mb-0 bold">{shorten(`${listing.admin}`)}</p>
                              </div>
                            </td>
                            <td>
                              <div >
                                <span>Qty:</span>
                                <p className="mb-0 bold">{listing.amount}</p>
                              </div>
                            </td>
                            <td>
                              <Button className="by no-wrap" onClick={() => { buyButtonMdalShow(), setPassPurchaseOrder(`${listing.offerId}`), togglePassModal(), setAmount(`${listing.amount}`), setTotal(`${listing.price}`), setFrom(`${listing.admin}`), setAvailable(`${listing.amount}`) }}>Buy mouse</Button>
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </Table>
              </div>
            </>
          }
        </div>

        <div className="sales mt-4">
          <h3>Recent Sales</h3>
          <Row className="justify-content-center">
            {sales.slice(0, 24).map((listing) => (
              <Col lg={3} md={6} sm={12} className="mt-3">
                <div className="sales-box">
                  {listing.tokenId === 0 && listing.amount > 1 && listing.token === addresses[chainID].NFT_CONTRACT_ADDRESS ? <img src={Mouse} alt="mouse icon" style={{ height: "60px", width: "60px" }} /> : listing.tokenId === 0 && listing.amount === 1 && listing.token === addresses[chainID].NFT_CONTRACT_ADDRESS ? <img src={Mouse} alt="mouse icon" style={{ height: "60px", width: "60px" }} /> : listing.tokenId === 1 && listing.amount > 1 ? <img src={Cat} alt="cat icon" style={{ height: "60px", width: "60px" }} /> : listing.tokenId === 1 && listing.amount <= 1 ? <img src={Cat} alt="cat icon" style={{ height: "60px", width: "60px" }} /> : listing.tokenId === 2 && listing.amount > 1 ? <img src={MouseTrap} alt="mouse trap icon" style={{ height: "60px", width: "60px" }} /> : listing.tokenId === 2 ? <img src={MouseTrap} alt="mouse trap icon" style={{ height: "60px", width: "60px" }} /> : listing.token === addresses[chainID].CHEEZPASS_CONTRACT_ADDRESS ? <img src={CheezPassGif} alt="cheesepass spinning gif" style={{ height: "60px", width: "60px" }} /> : ''}
                  {/* <img src={require('./mouse-market.png').default} alt="" width={100} /> */}
                  <span>for {(parseFloat(ethers.utils.formatUnits(`${listing.price}`, 9)) / listing.amount).toFixed(2)} 🧀 {listing.amount > 1 ? "each!" : ""}</span>
                  <span className="mt-2">{shorten(`${listing.admin}`)}</span>
                  <div className="box-total d-flex align-items-center justify-content-between mt-2">
                    <h5 className="mb-0">bought:</h5>
                    <span>{listing.amount}</span>
                  </div>
                  <div className="box-total d-flex align-items-center justify-content-between mt-2">
                    <h5 className="mb-0">Total:</h5>
                    <span>{parseFloat(ethers.utils.formatUnits(`${listing.price}`, 9)).toFixed(3)} 🧀</span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

        </div>

        <Modal show={buyButtonMdal} onHide={buyButtonMdalClose}>
          <Modal.Body className="modal-bg text-center">

            {passPurchaseOrder != null ? (
              <div className="preview">
                <h2>Preview Order</h2>
                <span>Available: {trim(cheezBalance, 4)} 🧀</span>
                <input type="text" value={trim(cheezBalance, 4)} />
                <div className="mt-4">
                  <span>From</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{shorten(from)}</span>
                </div>
                <div className="mt-2">
                  <span>To</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{shorten(address)} (You)</span>
                </div>
                <div className="mt-2">
                  <span>Amount</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{amount} {amount > 1 ? 'Mice' : 'Mouse'}</span>
                </div>
                <div className="mt-2">
                  <span>Total</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{parseInt(ethers.utils.formatUnits(`${total}`, 9) * amount)} 🧀 (CHEEZ)</span>
                </div>
                <div className="d-flex justify-content-center mt-4">
                  {approvalStatus === false ? (
                    <Button
                      className="approve"
                      onClick={onSeekApproval}
                    >
                      Approve
                    </Button>
                  ) : (
                    <Button
                      className="approve"
                      onClick={onBuy}
                    >
                      Confirm
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}

            {mousePurchaseOrder != null ? (
              <div className="preview">
                <h2>Preview Order</h2>
                <span>Available: {trim(cheezBalance, 4)} 🧀</span>
                <input type="text" value={trim(cheezBalance, 4)} />
                <div className="mt-4">
                  <span>From</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{shorten(from)}</span>
                </div>
                <div className="mt-2">
                  <span>To</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{shorten(address)} (You)</span>
                </div>
                <div className="mt-2">
                  <span>Amount</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{amount} {amount > 1 ? 'Cats' : 'Cat'}</span>
                </div>
                <div className="mt-2">
                  <span>Total</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{parseInt(ethers.utils.formatUnits(`${total}`, 9) * amount)} 🧀 (CHEEZ)</span>
                </div>
                <div className="d-flex justify-content-center mt-4">
                  {approvalStatus === false ? (
                    <Button
                      className="approve"
                      onClick={onSeekApproval}
                    >
                      Approve
                    </Button>
                  ) : (
                    <Button
                      className="approve"
                      onClick={onBuy}
                    >
                      Confirm
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}

            {catPurchaseOrder != null ? (
              <div className="preview">
                <h2>Preview Order</h2>
                <span>Available: {trim(cheezBalance, 4)} 🧀</span>
                <input type="text" value={trim(cheezBalance, 4)} />
                <div className="mt-4">
                  <span>From</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{shorten(from)}</span>
                </div>
                <div className="mt-2">
                  <span>To</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{shorten(address)} (You)</span>
                </div>
                <div className="mt-2">
                  <span>Amount</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{amount} {amount > 1 ? 'Cats' : 'Cat'}</span>
                </div>
                <div className="mt-2">
                  <span>Total</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{parseInt(ethers.utils.formatUnits(`${total}`, 9) * amount)} 🧀 (CHEEZ)</span>
                </div>
                <div className="d-flex justify-content-center mt-4">
                  {approvalStatus === false ? (
                    <Button
                      className="approve"
                      onClick={onSeekApproval}
                    >
                      Approve
                    </Button>
                  ) : (
                    <Button
                      className="approve"
                      onClick={onBuy}
                    >
                      Confirm
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}
            {trapPurchaseOrder != null ? (
              <div className="preview">
                <h2>Preview Order</h2>
                <span>Available: {trim(cheezBalance, 4)} 🧀</span>
                <input type="text" value={trim(cheezBalance, 4)} />
                <div className="mt-4">
                  <span>From</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{shorten(from)}</span>
                </div>
                <div className="mt-2">
                  <span>To</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{shorten(address)} (You)</span>
                </div>
                <div className="mt-2">
                  <span>Amount</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{amount} {amount > 1 ? 'Cats' : 'Cat'}</span>
                </div>
                <div className="mt-2">
                  <span>Total</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{parseInt(ethers.utils.formatUnits(`${total}`, 9) * amount)} 🧀 (CHEEZ)</span>
                </div>
                <div className="d-flex justify-content-center mt-4">
                  {approvalStatus === false ? (
                    <Button
                      className="approve"
                      onClick={onSeekApproval}
                    >
                      Approve
                    </Button>
                  ) : (
                    <Button
                      className="approve"
                      onClick={onBuy}
                    >
                      Confirm
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}

          </Modal.Body>
        </Modal>

        {passPurchaseOrder != null ? (
          <Modal show={buyButtonMdal} onHide={() => { buyButtonMdalClose(), setPassPurchaseOrder(null), setAmount(null), setTotal(null), setFrom(null), setAvailable(null) }}>
            <Modal.Body className="modal-bg text-center">
              <div className="preview">
                <h2>Preview Order</h2>
                <span>Available: {trim(cheezBalance, 4)} 🧀</span>
                <input type="text" value={trim(cheezBalance, 4)} />
                <div className="mt-4">
                  <span>From</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{shorten(from)}</span>
                </div>
                <div className="mt-2">
                  <span>To</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{shorten(address)} (You)</span>
                </div>
                <div className="mt-2">
                  <span>Amount</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{amount} {amount > 1 ? 'Mice' : 'Mouse'}</span>
                </div>
                <div className="mt-2">
                  <span>Total</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{parseInt(ethers.utils.formatUnits(`${total}`, 9) * amount)} 🧀 (CHEEZ)</span>
                </div>
                <div className="d-flex justify-content-center mt-4">
                  {approvalStatus === false ? (
                    <Button
                      className="approve"
                      onClick={onSeekApproval}
                    >
                      Approve
                    </Button>
                  ) : (
                    <Button
                      className="approve"
                      onClick={onBuy}
                    >
                      Confirm
                    </Button>
                  )}
                </div>
              </div>

            </Modal.Body>
          </Modal>
        ) : (
          <></>
        )}


        {mousePurchaseOrder != null ? (
          <Modal show={buyButtonMdal} onHide={() => { buyButtonMdalClose(), setMousePurchaseOrder(null), setAmount(null), setTotal(null), setFrom(null), setAvailable(null) }}>
            <Modal.Body className="modal-bg text-center">
              <div className="preview">
                <h2>Preview Order</h2>
                <span>Available: {trim(cheezBalance, 4)} 🧀</span>
                <input type="text" value={trim(cheezBalance, 4)} />
                <div className="mt-4">
                  <span>From</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{shorten(from)}</span>
                </div>
                <div className="mt-2">
                  <span>To</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{shorten(address)} (You)</span>
                </div>
                <div className="mt-2">
                  <span>Amount</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{amount} {amount > 1 ? 'Cats' : 'Cat'}</span>
                </div>
                <div className="mt-2">
                  <span>Total</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{parseInt(ethers.utils.formatUnits(`${total}`, 9) * amount)} 🧀 (CHEEZ)</span>
                </div>
                <div className="d-flex justify-content-center mt-4">
                  {approvalStatus === false ? (
                    <Button
                      className="approve"
                      onClick={onSeekApproval}
                    >
                      Approve
                    </Button>
                  ) : (
                    <Button
                      className="approve"
                      onClick={onBuy}
                    >
                      Confirm
                    </Button>
                  )}
                </div>
              </div>
            </Modal.Body>
          </Modal>
        ) : (
          <></>
        )}


        {catPurchaseOrder != null ? (
          <Modal show={buyButtonMdal} onHide={() => { buyButtonMdalClose(), setCatPurchaseOrder(null), setAmount(null), setTotal(null), setFrom(null), setAvailable(null) }}>
            <Modal.Body className="modal-bg text-center">
              <div className="preview">
                <h2>Preview Order</h2>
                <span>Available: {trim(cheezBalance, 4)} 🧀</span>
                <input type="text" value={trim(cheezBalance, 4)} />
                <div className="mt-4">
                  <span>From</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{shorten(from)}</span>
                </div>
                <div className="mt-2">
                  <span>To</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{shorten(address)} (You)</span>
                </div>
                <div className="mt-2">
                  <span>Amount</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{amount} {amount > 1 ? 'Cats' : 'Cat'}</span>
                </div>
                <div className="mt-2">
                  <span>Total</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{parseInt(ethers.utils.formatUnits(`${total}`, 9) * amount)} 🧀 (CHEEZ)</span>
                </div>
                <div className="d-flex justify-content-center mt-4">
                  {approvalStatus === false ? (
                    <Button
                      className="approve"
                      onClick={onSeekApproval}
                    >
                      Approve
                    </Button>
                  ) : (
                    <Button
                      className="approve"
                      onClick={onBuy}
                    >
                      Confirm
                    </Button>
                  )}
                </div>
              </div>
            </Modal.Body>
          </Modal>
        ) : (
          <></>
        )}


        {trapPurchaseOrder != null ? (
          <Modal show={buyButtonMdal} onHide={() => { buyButtonMdalClose(), setTrapPurchaseOrder(null), setAmount(null), setTotal(null), setFrom(null), setAvailable(null) }}>
            <Modal.Body className="modal-bg text-center">
              <div className="preview">
                <h2>Preview Order</h2>
                <span>Available: {trim(cheezBalance, 4)} 🧀</span>
                <input type="text" value={trim(cheezBalance, 4)} />
                <div className="mt-4">
                  <span>From</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{shorten(from)}</span>
                </div>
                <div className="mt-2">
                  <span>To</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{shorten(address)} (You)</span>
                </div>
                <div className="mt-2">
                  <span>Amount</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{amount} {amount > 1 ? 'Cats' : 'Cat'}</span>
                </div>
                <div className="mt-2">
                  <span>Total</span>
                  <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
                  <span>{parseInt(ethers.utils.formatUnits(`${total}`, 9) * amount)} 🧀 (CHEEZ)</span>
                </div>
                <div className="d-flex justify-content-center mt-4">
                  {approvalStatus === false ? (
                    <Button
                      className="approve"
                      onClick={onSeekApproval}
                    >
                      Approve
                    </Button>
                  ) : (
                    <Button
                      className="approve"
                      onClick={onBuy}
                    >
                      Confirm
                    </Button>
                  )}
                </div>
              </div>

            </Modal.Body>
          </Modal>
        ) : (
          <></>
        )}

      </div>
    </>
  );
}

export default Activity;
