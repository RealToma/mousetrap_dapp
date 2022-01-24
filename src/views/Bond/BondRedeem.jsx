import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Box, Slide } from "@material-ui/core";
import { redeemBond } from "../../slices/BondSlice";
import { useWeb3Context } from "src/hooks/web3Context";
import { trim, secondsUntilBlock, prettifySeconds, prettyVestingPeriod } from "../../helpers";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { Row, Col, Button, Modal, Tabs, Tab } from 'react-bootstrap';

function BondRedeem({ bond }) {
  // const { bond: bondName } = bond;
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();

  const isBondLoading = useSelector(state => state.bonding.loading ?? true);

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });
  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });
  const bondingState = useSelector(state => {
    return state.bonding && state.bonding[bond.name];
  });
  const bondDetails = useSelector(state => {
    return state.account.bonds && state.account.bonds[bond.name];
  });

  async function onRedeem({ autostake }) {
    await dispatch(redeemBond({ address, bond, networkID: chainID, provider, autostake }));
  }

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bond.bondMaturationBlock);
  };

  const vestingPeriod = () => {
    if(bondingState){
      const vestingBlock = parseInt(currentBlock) + parseInt(bondingState.vestingTerm);
      const seconds = secondsUntilBlock(currentBlock, vestingBlock);
      return prettifySeconds(seconds, "day");
    }
  };

  useEffect(() => {
    console.log(bond);
    console.log(bondingState);
    console.log(bondDetails);
  }, []);

  return (
    <>
      <Row>
        <Col lg={6}>
          <Button
            className="mini-bg-gray"
            // disabled={isPendingTxn(pendingTransactions, "redeem_bond_" + bond.name) || bond.pendingPayout == 0.0}
            onClick={() => {
              onRedeem({ autostake: false });
            }}>
            <h5 className="mb-0">{txnButtonText(pendingTransactions, "redeem_bond_" + bond.name, "Claim")}</h5>
          </Button>
        </Col>
        <Col lg={6}>
          <Button className="mini-bg-gray"
            // disabled={
            //   isPendingTxn(pendingTransactions, "redeem_bond_" + bond.name + "_autostake") || bond.pendingPayout == 0.0
            // }
            onClick={() => {
              onRedeem({ autostake: true });
            }}>
            <h5 className="mb-0">{txnButtonText(pendingTransactions, "redeem_bond_" + bond.name + "_autostake", "Claim and AutoAge")}</h5>
          </Button>
        </Col>
      </Row>
      <div className="bond-def mt-3">
        <div className="d-flex mt-2">
          <span>Pending Rewards</span>
          <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _</span>
          <span>{isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.interestDue, 4)} CHEEZ`}</span>
        </div>
        <div className="d-flex mt-2">
          <span>Claimable Rewards</span>
          <span>_ _ _ _ _ _ _ _ _ _ _ _ _</span>
          <span>{isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.pendingPayout, 4)} CHEEZ`}</span>
        </div>
        <div className="d-flex mt-2">
          <span>Time until fully vested</span>
          <span>_ _ _ _ _ _ _ _ _ _ _</span>
          <span>{isBondLoading ? <Skeleton width="100px" /> : vestingTime()}</span>
        </div>
        <div className="d-flex mt-2">
          <span>ROI</span>
          <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</span>
          <span>{isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.bondDiscount * 100, 2)}%`}</span>
        </div>
        <div className="d-flex mt-2">
          <span>Debt Ratio</span>
          <span>_ _ _ _ _ _  _ _ _ _ _ _ _ _ _ _ _ _</span>
          <span>{isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.debtRatio / 10000000, 2)}%`}</span>
        </div>
        <div className="d-flex mt-2">
          <span>Vesting Term</span>
          <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</span>
          <span>{isBondLoading ? <Skeleton width="100px" /> : vestingPeriod()}</span>
        </div>
      </div>
    </>
  );
}

export default BondRedeem;
