import { ethers } from "ethers";
import { addresses } from "../constants";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as Pass } from "../abi/Pass.json";
import { IBaseAsyncThunk, IMintNFTAsyncThunk } from "./interfaces";
import { useWeb3Context } from "src/hooks/web3Context";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { error, info } from "./MessagesSlice";



const initialState = {

};

export const mintReservedNFT = createAsyncThunk(
    "mintReserved/mintNFT",
    async ({ provider, networkID, index, proof}: IMintNFTAsyncThunk, { dispatch }) => {
        if (!provider) {
        dispatch(error("Please connect your wallet!"));
        return;
        }

        const signer = provider.getSigner();
        const mintContract = new ethers.Contract(addresses[networkID].CHEEZPASS_CONTRACT_ADDRESS as string, Pass, signer);

        let mintTx
        try {
            mintTx = await mintContract.claim(index, proof)
            const text = "Mint NFT";
            const pendingTxnType = "mint_NFT";
            dispatch(fetchPendingTxns({ txnHash: mintTx.hash, text, type: pendingTxnType }));
            mintTx.wait();
        } catch (e: unknown) {
            dispatch(error((e as IJsonRPCError).message));
            return;
        } finally {
            if (mintTx) {
              dispatch(info("NFT Claimed!"))  
              dispatch(clearPendingTxn(mintTx.hash));
            }
          }
    }
)