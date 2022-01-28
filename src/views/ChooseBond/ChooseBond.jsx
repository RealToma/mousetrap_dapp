import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Zoom,
  Link,
  SvgIcon
} from "@material-ui/core";
import { BondDataCard, BondTableData } from "./BondRow";
import { useWeb3Context } from "src/hooks/web3Context";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { formatCurrency } from "../../helpers";
import useBonds from "../../hooks/Bonds";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import ClaimBonds from "./ClaimBonds";
import _ from "lodash";
import { allBondsMap } from "src/helpers/AllBonds";
import { Row, Col, Button, Modal, Tabs, Tab } from 'react-bootstrap'
import { responsiveFontSizes } from '@material-ui/core/styles';
import BondLogo from "../../components/BondLogo";
import { trim } from "../../helpers";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import BondPurchase from "../Bond/BondPurchase";
import BondRedeem from "../Bond/BondRedeem";

function ChooseBond() {
  const { bonds } = useBonds();
  const { chainID, address } = useWeb3Context();

  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const isVerySmallScreen = useMediaQuery("(max-width: 420px)");

  const networkId = "1666600000"
  // const isBondLoading = !bond.bondPrice ?? true;

  const isAppLoading = useSelector(state => state.app.loading);
  const isAccountLoading = useSelector(state => state.account.loading);

  const accountBonds = useSelector(state => {
    const withInterestDue = [];
    for (const bond in state.account.bonds) {
      if (state.account.bonds[bond].interestDue > 0) {
        withInterestDue.push(state.account.bonds[bond]);
      }
    }
    return withInterestDue;
  });

  const isBondLoading = useSelector(state => state.bonding.loading ?? true);

  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });

  const treasuryBalance = useSelector(state => {
    if (state.bonding.loading == false) {
      let tokenBalances = 0;
      for (const bond in allBondsMap) {
        if (state.bonding[bond]) {
          if (state.bonding[bond].bond != "ohm_dai_lp" && state.bonding[bond].bond != "cheez_dai_lp") {
            tokenBalances += state.bonding[bond].purchased;
          }
        }
      }
      tokenBalances += 750000
      return tokenBalances;
    }
  });

  const [slippage, setSlippage] = useState(0.5);
  const [recipientAddress, setRecipientAddress] = useState(address);

  const onRecipientAddressChange = e => {
    return setRecipientAddress(e.target.value);
  };

  useEffect(() => {
    if (address) setRecipientAddress(address);
  }, [address]);

  const onSlippageChange = e => {
    return setSlippage(e.target.value);
  };

  const [isActive, setIsActive] = useState(2);

  const [tabActive, setTabActive] = useState(1)

  const [modalValue, setModalValue] = useState([]);

  const [modal1, setModal1] = useState(false);
  const Modal1Close = () => setModal1(false);
  const Modal1Open = () => setModal1(true);

  const [modal2, setModal2] = useState(false);
  const Modal2Close = () => setModal2(false);
  const Modal2Open = () => setModal2(true);

  return (
    <>
      <div className="bond-main px-3">
        <Row>
          <Col lg={4} md={6} sm={12} className="mt-3">
            <div className={`${isActive === 1 ? "active" : ""} wight-bg`} onClick={() => setIsActive(1)}>
              <span>CheeseDAO Treasury</span>
              <h1 className="mb-0 mt-2">{isAppLoading ? (
                <Skeleton width="180px" />
              ) : (
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                }).format(treasuryBalance)
              )}</h1>
            </div>
          </Col>
          <Col lg={4} md={6} sm={12} className="mt-3">
            <div className={`${isActive === 2 ? "active" : ""} wight-bg`} onClick={() => setIsActive(2)}>
              <div className="d-flex align-items-center justify-content-between">
                <span>Cheez Price</span>
                <span className="green-toc">+2.45%</span>
              </div>
              <h1 className="mb-0 mt-2">{isAppLoading ? <Skeleton width="100px" /> : formatCurrency(marketPrice, 2)}</h1>
            </div>
          </Col>
        </Row>
        <div className="bond-table mt-5">
          <Table responsive>
            <thead>
              <tr>
                <th>Bond</th>
                <th>Price</th>
                <th>ROI</th>
                <th>Purchased</th>
              </tr>
            </thead>
            <tbody>
              {bonds.filter(b => b.isAvailable[chainID]).map(bond => (
                <tr>
                  <td>
                    <div className="d-flex align-items-center gap w-250">
                      <BondLogo bond={bond} />
                      <div className="bond-heding">
                        <h4 className="mb-0">{bond.displayName}</h4>
                        {bond.isLP && (
                          <Link color="primary" href={bond.lpUrl} target="_blank">
                            <span>
                              Add Liquidity
                              <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{trim(bond.bondPrice, 2)}</td>
                  <td>`${trim(bond.bondDiscount * 100, 2)}%`</td>
                  <td>{new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(bond.purchased)}
                  </td>
                  <td>
                    <Button className="bond-btn" disabled={!bond.isAvailable[networkId]}
                      onClick={() => {
                        Modal1Open(),
                          setModalValue(bond);
                      }} >
                      {!bond.isAvailable[networkId] ? "Expired" : `Bond`}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={modal1} onHide={() => {
        Modal1Close(),
          setModalValue([]);
      }}>
        <Modal.Body className="modal-bond">
          <button style={{
            position: "absolute",
            right: "0",
            top: "-1px",
            height: "24px",
            width: "24px",
            background: "transparent",
            border: "none"
          }} onClick={Modal1Close}></button>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex gap align-items-center">
              <BondLogo bond={modalValue} />
              <h3 className="mb-0">CHEEZ-DAI LP</h3>
            </div>
            <Button className="setting" onClick={() => { Modal1Close(); Modal2Open(); }}>
              <img src={require('./setting.svg').default} alt="" />
            </Button>
          </div>
          <Row className="mt-3">
            <Col lg={6} md={12} className="mt-3">
              <div className="bg-wight-bond">
                <span>Bond Price</span>
                <h3 className="mb-0">{isBondLoading ? <Skeleton /> : formatCurrency(modalValue.bondPrice, 2)}</h3>
              </div>
            </Col>
            <Col lg={6} md={12} className="mt-3">
              <div className="bg-wight-bond">
                <span>Market Price</span>
                <h3 className="mb-0">{isBondLoading ? <Skeleton /> : formatCurrency(modalValue.marketPrice, 2)}</h3>
              </div>
            </Col>
          </Row>

          <div className="maintabs mt-4">
            <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
              <Tab eventKey="home" title="Bond">
                <BondPurchase bond={modalValue} />
              </Tab>
              <Tab eventKey="profile" title="Redeem">
                <BondRedeem bond={modalValue} />
              </Tab>
            </Tabs>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={modal2} onHide={Modal2Close}>
        <Modal.Body className="setting-modal">
          <button style={{
            position: "absolute",
            right: "0",
            top: "-1px",
            height: "24px",
            width: "24px",
            background: "transparent",
            border: "none"
          }} onClick={Modal2Close}></button>
          <h3>Settings</h3>
          <div>
            <span>Slippage</span>
            <input type="text" value={slippage}
              onChange={onSlippageChange} />
            <p>Transaction may revert if price changes by more than slippage %</p>
          </div>
          <div>
            <span>Recipient Address</span>
            <input type="text" value={recipientAddress} onChange={onRecipientAddressChange} />
            <p>Choose recipient address. By default, this is your currently connected address</p>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ChooseBond;
