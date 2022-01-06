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

export const mintNFT = createAsyncThunk(
    "mint/mintNFT",
    async ({ provider, networkID}: IMintNFTAsyncThunk, { dispatch }) => {
        if (!provider) {
        dispatch(error("Please connect your wallet!"));
        return;
        }

        const signer = provider.getSigner();
        const mintContract = new ethers.Contract(addresses[networkID].CHEEZPASS_CONTRACT_ADDRESS as string, Pass, signer);

        let mintTx
        try {
            mintTx = await mintContract.purchase();
            const text = "Mint NFT";
            const pendingTxnType = "mint_NFT";
            dispatch(fetchPendingTxns({ txnHash: mintTx.hash, text, type: pendingTxnType }));
            mintTx.wait();
        } catch (e: unknown) {
            dispatch(error((e as IJsonRPCError).message));
            return;
        } finally {
            if (mintTx) {
              dispatch(info("NFT Purchased!"))  
              dispatch(clearPendingTxn(mintTx.hash));
            }
          }
    }
)

export const changeApproval = createAsyncThunk(
    "mint/changeApproval",
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
            addresses[networkID].CHEEZPASS_CONTRACT_ADDRESS,
            ethers.utils.parseUnits("1000000000", "gwei").toString(),
          );
        const text = "Approve Minting";
        const pendingTxnType = "approve_minting";
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
  
        await approveTx.wait();
      } catch (e: unknown) {
        dispatch(error((e as IJsonRPCError).message));
        return;
      } finally {
        if (approveTx) {
          dispatch(info("Approved"))
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