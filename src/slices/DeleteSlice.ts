import { ethers } from "ethers";
import { addresses } from "../constants";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as Minter } from "../abi/Minter.json";
import { abi as Market } from "../abi/Market.json";
import { IBaseAsyncThunk, IDeleteAsyncThunk } from "./interfaces";
import { useWeb3Context } from "src/hooks/web3Context";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { error, info } from "../slices/MessagesSlice";

const initialState = {};

export const deleteListing = createAsyncThunk(
    "list/deleteListing",
    async ({ provider, offerID }: IDeleteAsyncThunk, { dispatch }) => {
        if (!provider) {
        dispatch(error("Please connect your wallet!"));
        return;
        }

        const signer = provider.getSigner();
        const networkID = 1666600000
        console.log(offerID)
        const marketplaceContract = new ethers.Contract(addresses[networkID].MARKETPLACE_ADDRESS, Market, signer);
        let delTx
        try {
            delTx = await marketplaceContract.cancelOffer(
                offerID,
            );
            const text = "Remove NFT Listing";
            const pendingTxnType = "delete_NFT";
            dispatch(fetchPendingTxns({ txnHash: delTx.hash, text, type: pendingTxnType }));
            delTx.wait();
        } catch (e: unknown) {
            dispatch(error((e as IJsonRPCError).message));
            return;
        } finally {
            if (delTx) {
              dispatch(info("Listing Removed"))  
              dispatch(clearPendingTxn(delTx.hash));
            }
          }
    }
)
