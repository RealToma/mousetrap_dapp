import { ethers } from "ethers";
import { addresses } from "../constants";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances, loadAccountDetails } from "./AccountSlice";
import { IChangeApprovalAsyncThunk, IGameStakeThunk, IJsonRPCError } from "./interfaces";
import { error } from "./MessagesSlice";

//abi
import { abi as Minter } from "../abi/Minter.json";
import { abi as Game } from "../abi/Game.json";

export const changeApproval = createAsyncThunk(
    'game/changeApproval',
     async ({ provider, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
        if (!provider) {
          dispatch(error("Please connect your wallet!"));
          return;
        }

        const signer = provider.getSigner();
        const gameContract = new ethers.Contract(addresses[networkID].NFT_CONTRACT_ADDRESS as string, Minter, signer);

        let approveTx;
        try {
            approveTx = await gameContract.setApprovalForAll(
                addresses[networkID].GAME_CONTRACT_ADDRESS,
                true
            );

            const text = "Approve the Game";
            const pendingTxnType = "approve_game";
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
    }

)

export const gameStake = createAsyncThunk(
    'game/stake',
    async ({ id, amount, provider, networkID }: IGameStakeThunk, { dispatch }) => {
        if (!provider) {
          dispatch(error("Please connect your wallet!"));
          return;
        }

        const signer = provider.getSigner();
        const gameContract = new ethers.Contract(addresses[networkID].GAME_CONTRACT_ADDRESS as string, Game, signer);

        let stakeTx;
        try {
            stakeTx = await gameContract.stake(id, amount);

            const text = "Stake"
            const pendingTxnType = "game_stake"
            dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: text, type: pendingTxnType }));
            await stakeTx.wait();
        } catch (e: unknown) {
            dispatch(error((e as IJsonRPCError).message));
            return;
        } finally {
            if (stakeTx) {
                dispatch(clearPendingTxn(stakeTx.hash));
              }
            }});

export const gameUnstake = createAsyncThunk(
    'game/unstake',
    async ({ id, amount, provider, networkID }: IGameStakeThunk, { dispatch }) => {
        if (!provider) {
            dispatch(error("Please connect your wallet!"));
            return;
        }

        const signer = provider.getSigner();
        const gameContract = new ethers.Contract(addresses[networkID].GAME_CONTRACT_ADDRESS as string, Game, signer);

        let unstakeTx;
        try {
            unstakeTx = await gameContract.unstake(id, amount);

            const text = "Unstake"
            const pendingTxnType = "game_unstake"
            dispatch(fetchPendingTxns({ txnHash: unstakeTx.hash, text: text, type: pendingTxnType }));
            await unstakeTx.wait();
        } catch (e: unknown) {
            dispatch(error((e as IJsonRPCError).message));
            return;
        } finally {
            if (unstakeTx) {
                dispatch(clearPendingTxn(unstakeTx.hash));
                }
            }});

export const gameClaimRewards = createAsyncThunk(
    'game/claim',
    async ({ id, provider, networkID }: IGameStakeThunk, { dispatch }) => {
        if (!provider) {
            dispatch(error("Please connect your wallet!"));
            return;
        }

        const signer = provider.getSigner();
        const gameContract = new ethers.Contract(addresses[networkID].GAME_CONTRACT_ADDRESS as string, Game, signer);

        let claimTx;
        try {
            claimTx = await gameContract.claimRewards(id);

            const text = "Claim"
            const pendingTxnType = "game_claim"
            dispatch(fetchPendingTxns({ txnHash: claimTx.hash, text: text, type: pendingTxnType }));
        } catch (e: unknown) {
            dispatch(error((e as IJsonRPCError).message));
            return;
        } finally {
            if (claimTx) {
                dispatch(clearPendingTxn(claimTx.hash));
                }
            }});