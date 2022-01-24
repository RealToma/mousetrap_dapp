import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Slide,
  Typography,
} from "@material-ui/core";
import { prettifySeconds, secondsUntilBlock, shorten, trim } from "../../helpers";
import { bondAsset, calcBondDetails, changeApproval } from "../../slices/BondSlice";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import useDebounce from "../../hooks/Debounce";
import { error } from "../../slices/MessagesSlice";
import { Button } from 'react-bootstrap'

function BondPurchase({ bond, slippage, recipientAddress }) {
  const SECONDS_TO_REFRESH = 60;
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();

  const [quantity, setQuantity] = useState("");
  const [secondsToRefresh, setSecondsToRefresh] = useState(SECONDS_TO_REFRESH);

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });

  const isBondLoading = useSelector(state => state.bonding.loading ?? true);

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const vestingPeriod = () => {
    if (bond) {
      const vestingBlock = parseInt(currentBlock) + parseInt(bond.vestingTerm);
      const seconds = secondsUntilBlock(currentBlock, vestingBlock);
      return prettifySeconds(seconds, "day");
    }
  };

  async function onBond() {
    if (quantity === "") {
      dispatch(error("Please enter a value!"));
    } else if (isNaN(quantity)) {
      dispatch(error("Please enter a valid value!"));
    } else if (bond.interestDue > 0 || bond.pendingPayout > 0) {
      const shouldProceed = window.confirm(
        "You have an existing bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?",
      );
      if (shouldProceed) {
        await dispatch(
          bondAsset({
            value: quantity,
            slippage,
            bond,
            networkID: chainID,
            provider,
            address: recipientAddress || address,
          }),
        );
      }
    } else {
      await dispatch(
        bondAsset({
          value: quantity,
          slippage,
          bond,
          networkID: chainID,
          provider,
          address: recipientAddress || address,
        }),
      );
      clearInput();
    }
  }

  const clearInput = () => {
    setQuantity(0);
  };

  const hasAllowance = useCallback(() => {
    return bond.allowance > 0;
  }, [bond.allowance]);

  const setMax = () => {
    let maxQ;
    if (bond.maxBondPrice * bond.bondPrice < Number(bond.balance)) {
      // there is precision loss here on Number(bond.balance)
      maxQ = bond.maxBondPrice * bond.bondPrice.toString();
    } else {
      maxQ = bond.balance;
    }
    setQuantity(maxQ);
  };

  const bondDetailsDebounce = useDebounce(quantity, 1000);

  useEffect(() => {
    dispatch(calcBondDetails({ bond, value: quantity, provider, networkID: chainID }));
  }, [bondDetailsDebounce]);

  useEffect(() => {
    let interval = null;
    if (secondsToRefresh > 0) {
      interval = setInterval(() => {
        setSecondsToRefresh(secondsToRefresh => secondsToRefresh - 1);
      }, 1000);
    } else {
      clearInterval(interval);
      dispatch(calcBondDetails({ bond, value: quantity, provider, networkID: chainID }));
      setSecondsToRefresh(SECONDS_TO_REFRESH);
    }
    return () => clearInterval(interval);
  }, [secondsToRefresh, quantity]);

  const onSeekApproval = async () => {
    dispatch(changeApproval({ address, bond, provider, networkID: chainID }));
  };

  const displayUnits = bond.displayUnits;

  const isAllowanceDataLoading = bond.allowance == null;

  return (
    <>
      {isAllowanceDataLoading ? (
        <Skeleton width="200px" />
      ) : (
        <>

          {!hasAllowance() ? (
            <div className="help-text">
              <em>
                <Typography variant="body1" align="center" color="textSecondary" className="text-black">
                  First time bonding <b>{bond.displayName}</b>? <br /> Please approve CheeseDAO to use your{" "}
                  <b>{bond.displayName}</b> for bonding.
                </Typography>
              </em>
            </div>
          ) : (
            <div className="search-bar mt-2">
              <span>Amount</span>
              <div className="d-flex gap">
                <div className="border-gray d-flex align-items-center w-100">
                  <input type="text" value={quantity}
                    onChange={e => setQuantity(e.target.value)} />
                  <span className="max" onClick={setMax}>Max</span>
                </div>
              </div>
            </div>
          )}

          <div className="d-flex justify-content-center">
            {!bond.isAvailable[chainID] ? (
              <Button
                className="approve-btn"
                disabled={true}
              >
                Expired
              </Button>
            ) : hasAllowance() && bond.bondQuote > 0.01 ? (
              <Button
                className="approve-btn"
                disabled={isPendingTxn(pendingTransactions, "bond_" + bond.name)}
                onClick={onBond}
              >
                {txnButtonText(pendingTransactions, "bond_" + bond.name, "Bond")}
              </Button>
            ) : (
              <Button
                className="approve-btn"
                disabled={isPendingTxn(pendingTransactions, "approve_" + bond.name)}
                onClick={onSeekApproval}
              >
                {txnButtonText(pendingTransactions, "approve_" + bond.name, "Approve")}
              </Button>
            )}
          </div>
        </>
      )}
      <div className="bond-def mt-3">
        <div className="d-flex mt-2">
          <span>Your Balance</span>
          <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</span>
          <span>{isBondLoading ? (
            <Skeleton width="100px" />
          ) : (
            <>
              {trim(bond.balance, 4)} {displayUnits}
            </>
          )}</span>
        </div>
        <div className="d-flex mt-2">
          <span>You Will Get</span>
          <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</span>
          <span>{isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.bondQuote, 4) || "0"} CHEEZ`}</span>
        </div>
        <div className="d-flex mt-2">
          <span>Max You Can Buy</span>
          <span>_ _ _ _ _ _ _ _ _ _ _</span>
          <span>{isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.maxBondPrice, 4) || "0"} CHEEZ`}</span>
        </div>
        <div className="d-flex mt-2">
          <span>ROI</span>
          <span>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</span>
          <span>{isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.bondDiscount * 100, 2)}%`}</span>
        </div>
        <div className="d-flex mt-2">
          <span>Debt Ratio</span>
          <span> _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ </span>
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

export default BondPurchase;
