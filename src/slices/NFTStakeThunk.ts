import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as Minter } from "../abi/Minter.json";
import { abi as OlympusStaking } from "../abi/OlympusStakingv2.json";
import { abi as LinearCheese } from "../abi/LinearCheese.json";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { error } from "./MessagesSlice";
import { IActionValueAsyncThunk, IActionValueTwoAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import { useAddress, useWeb3Context } from "../hooks/web3Context";
import { loadAccountDetails } from "./AccountSlice";

interface IUAData {
  address: string;
  value: number;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

export const changeApproval = createAsyncThunk(
  "stakeNFT/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();

    const nftContract = new ethers.Contract(addresses[networkID].NFT_CONTRACT_ADDRESS as string, Minter, signer);
    const miceStakeContract = new ethers.Contract(addresses[networkID].MICE_STAKING_CONTRACT as string, LinearCheese, signer);
    const catStakeContract = new ethers.Contract(addresses[networkID].CAT_STAKING_CONTRACT as string, LinearCheese, signer);
    const trapStakeContract = new ethers.Contract(addresses[networkID].TRAP_STAKING_CONTRACT as string, LinearCheese, signer);


    let approveTx;
    try {
      if (token === "mice") {
        approveTx = await nftContract.setApprovalForAll(
          addresses[networkID].MICE_STAKING_CONTRACT,
          true
        );
      } else if (token === "cats") {
        approveTx = await nftContract.setApprovalForAll(
          addresses[networkID].CAT_STAKING_CONTRACT,
          true
        );
      } else if (token === "traps") {
        approveTx = await nftContract.setApprovalForAll(
          addresses[networkID].TRAP_STAKING_CONTRACT,
          true
        );
      }
      const text = "Approve " + (token === "mice" || token === "cats" || token === "traps" ? "Staking" : "Unstaking");
      const pendingTxnType = token === "mice" || token === "cats" || token === "traps" ? "approve_staking" : "approve_unstaking";
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

    const miceStakingAllowance = await nftContract.isApprovedForAll(address, addresses[networkID].MICE_STAKING_CONTRACT);
    const catStakingAllowance = await nftContract.isApprovedForAll(address, addresses[networkID].CAT_STAKING_CONTRACT);
    const trapStakingAllowance = await nftContract.isApprovedForAll(address, addresses[networkID].TRAP_STAKING_CONTRACT);
    
    return dispatch(
      fetchAccountSuccess({
        staking: {
          miceStake: +miceStakingAllowance,
          catStake: +catStakingAllowance,
          trapStake: +trapStakingAllowance
        },
      }),
    );
  },
);

export const changeNFTStake = createAsyncThunk(
  "stakeNFT/changeStake",
  async ({ action, value, token, provider, address, networkID }: IActionValueTwoAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(addresses[networkID].NFT_CONTRACT_ADDRESS as string, Minter, signer);
    const miceStakeContract = new ethers.Contract(addresses[networkID].MICE_STAKING_CONTRACT as string, LinearCheese, signer);
    const catStakeContract = new ethers.Contract(addresses[networkID].CAT_STAKING_CONTRACT as string, LinearCheese, signer);
    const trapStakeContract = new ethers.Contract(addresses[networkID].TRAP_STAKING_CONTRACT as string, LinearCheese, signer);

    let stakeTx;
    let uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      if (action === "stake") {
        uaData.type = "stake";
        if (token === 'mice') {
          stakeTx = await miceStakeContract.stake(value);
        } else if (token === 'cats') {
          stakeTx = await catStakeContract.stake(value);
        } else if (token === 'traps') {
          stakeTx = await trapStakeContract.stake(value);
        }
      } else {
        uaData.type = "unstake";
        if (token === 'mice') {
          stakeTx = await miceStakeContract.unstake();
        } else if (token === 'cats') {
          stakeTx = await catStakeContract.unstake();
        } else if (token === 'traps') {
          stakeTx = await trapStakeContract.unstake();
        }
      }
      const pendingTxnType = action === "stake" ? "staking" : "unstaking";
      uaData.txHash = stakeTx.hash;
      dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
      await stakeTx.wait();
    } catch (e: unknown) {
      console.log(e)
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (stakeTx) {
        segmentUA(uaData);

        dispatch(clearPendingTxn(stakeTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
  },
);

export const claimRewards = createAsyncThunk(
  "stakeNFT/claimRewards",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(addresses[networkID].NFT_CONTRACT_ADDRESS as string, Minter, signer);
    const miceStakeContract = new ethers.Contract(addresses[networkID].MICE_STAKING_CONTRACT as string, LinearCheese, signer);
    const catStakeContract = new ethers.Contract(addresses[networkID].CAT_STAKING_CONTRACT as string, LinearCheese, signer);
    const trapStakeContract = new ethers.Contract(addresses[networkID].TRAP_STAKING_CONTRACT as string, LinearCheese, signer);

    let stakeTx;
    let uaData: IUAData = {
      address: address,
      value: 0,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      if (token === "mice") {
        stakeTx = await miceStakeContract.claimRewards()
      } else if (token === "cats") {
        stakeTx = await catStakeContract.claimRewards()
      } else if (token === "traps") {
        stakeTx = await trapStakeContract.claimRewards()
      }

      const pendingTxnType = "claiming"
      uaData.txHash = stakeTx.hash;
      dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText("claiming"), type: pendingTxnType }));
      await stakeTx.wait();
    } catch (e: unknown) {
      console.log(e)
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (stakeTx) {
        segmentUA(uaData);

        dispatch(clearPendingTxn(stakeTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
  },
);
