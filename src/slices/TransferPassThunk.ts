import { ethers } from "ethers";
import { addresses } from "../constants";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { error, info } from "./MessagesSlice";
import { IActionValueAsyncThunk, IActionValueTwoAsyncThunk, ITransferNFTAsyncThunk, IJsonRPCError } from "./interfaces";
import { abi as Pass } from "../abi/Pass.json";

export const transferPass = createAsyncThunk(
    "nft/transferPass",
    async ({amount, id, address, toAddress, provider, networkID }: ITransferNFTAsyncThunk, {dispatch}) => {
        if (!provider) {
            dispatch(error("Please connect your wallet!"));
            return;
        }

        const signer = provider.getSigner();
        const passContract = new ethers.Contract(addresses[networkID].CHEEZPASS_CONTRACT_ADDRESS as string, Pass, signer);

        let transferTx;
        console.log(address, amount, id, toAddress, provider, networkID)
        try {
            transferTx = await passContract.safeTransferFrom(address, toAddress, id, amount, "0x00")

            const text = "Transferring NFT";
            const pendingTxnType = "transfer_nft";
            dispatch(fetchPendingTxns({ txnHash: transferTx.hash, text, type: pendingTxnType }));
            await transferTx.wait();
        } catch (e: unknown) {
            dispatch(error((e as IJsonRPCError).message));
            return;
        } finally {
            if (transferTx) {
                dispatch(info("Tranfer Complete!"))
                dispatch(clearPendingTxn(transferTx.hash));
            }
        }
    }
)
