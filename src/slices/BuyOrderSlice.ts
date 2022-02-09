import { ethers } from "ethers";
import { addresses } from "../constants";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as BuyOrder } from "../abi/BuyOrder.json";
import { IBaseAsyncThunk, IBuyListingAsyncThunk } from "./interfaces";
import { useWeb3Context } from "src/hooks/web3Context";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { error, info } from "../slices/MessagesSlice";

const initialState = {}

    export const BuyListing = createAsyncThunk(
        "list/createListing",
        async ({ provider, amount, address, offerID }: IBuyListingAsyncThunk, { dispatch }) => {
            console.log(provider, amount, address, offerID)
            if (!provider) {
            dispatch(error("Please connect your wallet!"));
            return;
            }

            const signer = provider.getSigner();
            const networkID = 1666600000
            console.log(amount, offerID)
            const marketplaceContract = new ethers.Contract(addresses[networkID].MARKETPLACE_ADDRESS, BuyOrder, signer);
            const deadline = Number(Math.floor(Date.now() / ( 1000 )) + ( 60 * 60 * 24 * 365));
            let listTx
            try {
                listTx = await marketplaceContract.BuyOffer(
                    offerID,
                    amount,
                );
                const text = "Buy NFT";
                const pendingTxnType = "buy_NFT";
                dispatch(fetchPendingTxns({ txnHash: listTx.hash, text, type: pendingTxnType }));
                listTx.wait();
            } catch (e: unknown) {
                dispatch(error((e as IJsonRPCError).message));
                return;
            } finally {
                if (listTx) {
                  dispatch(info("Purchased!"))
                  dispatch(clearPendingTxn(listTx.hash));
                }
              }
        }
    )

    export const changeApproval = createAsyncThunk(
        "buy/changeApproval",
        async ({ provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
          if (!provider) {
            dispatch(error("Please connect your wallet!"));
            return;
          }

          const signer = provider.getSigner();
          const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20Abi, signer);
          let approveTx;
          try {
              approveTx = await ohmContract.approve(
                addresses[networkID].MARKETPLACE_ADDRESS,
                ethers.utils.parseUnits("1000000000", "gwei").toString(),
              );
            const text = "Approve Buying";
            const pendingTxnType = "approve_buying";
            dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

            await approveTx.wait();
          } catch (e: unknown) {
            dispatch(error((e as IJsonRPCError).message));
            return;
          } finally {
            if (approveTx) {
              dispatch(clearPendingTxn(approveTx.hash));
            }
          }

          const stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
          return dispatch(
            fetchAccountSuccess({
              staking: {
                ohmStake: +stakeAllowance,
              },
            }),
          );
        },
      );
