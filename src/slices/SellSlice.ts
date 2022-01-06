import { ethers } from "ethers";
import { addresses } from "../constants";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as Minter } from "../abi/Minter.json";
import { abi as Market } from "../abi/Market.json";
import { IBaseAsyncThunk, ICreateListingAsyncThunk } from "./interfaces";
import { useWeb3Context } from "src/hooks/web3Context";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { error, info } from "../slices/MessagesSlice";

const initialState = {}


export const changeApproval = createAsyncThunk(
    "list/changeApproval",
    async ({ provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
      if (!provider) {
        dispatch(error("Please connect your wallet!"));
        return;
      }
  
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(addresses[networkID].NFT_CONTRACT_ADDRESS as string, Minter, signer);
      let approveTx;
      try {
          approveTx = await nftContract.setApprovalForAll(
            addresses[networkID].MARKETPLACE_ADDRESS,
            true
            );
        const text = "Approve Listing";
        const pendingTxnType = "approve_listing";
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
    })

    export const createListing = createAsyncThunk(
        "list/createListing",
        async ({ provider, amount, address, spawnId, listPrice }: ICreateListingAsyncThunk, { dispatch }) => {
            if (!provider) {
            dispatch(error("Please connect your wallet!"));
            return;
            }
    
            const signer = provider.getSigner();
            const networkID = 1666600000
            const marketplaceContract = new ethers.Contract(addresses[networkID].MARKETPLACE_ADDRESS, Market, signer);
            const deadline = Number(Math.floor(Date.now() / ( 1000 )) + ( 60 * 60 * 24 * 365));
            const price = ethers.utils.parseUnits(listPrice, 9)
            let listTx
            try {
                listTx = await marketplaceContract.MakeOffer(
                    addresses[networkID].NFT_CONTRACT_ADDRESS,
                    spawnId,
                    amount,
                    deadline,
                    price
                );
                const text = "List NFT";
                const pendingTxnType = "list_NFT";
                dispatch(fetchPendingTxns({ txnHash: listTx.hash, text, type: pendingTxnType }));
                listTx.wait();
            } catch (e: unknown) {
                dispatch(error((e as IJsonRPCError).message));
                return;
            } finally {
                if (listTx) {
                  dispatch(info("Listing Created!"))
                  dispatch(clearPendingTxn(listTx.hash));
                }
              }
        }
    )