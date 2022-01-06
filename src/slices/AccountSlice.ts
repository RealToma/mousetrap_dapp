import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as Minter } from "../abi/Minter.json";
import { abi as Market } from "../abi/Market.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as fuseProxy } from "../abi/FuseProxy.json";
import { abi as wsOHM } from "../abi/wsOHM.json";
import { abi as LinearCheese } from "../abi/LinearCheese.json";
import { abi as stake } from "../abi/OlympusStakingv2.json"
import { abi as Game } from "../abi/Game.json";
import { abi as Pass } from "../abi/Pass.json";

import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { Bond, NetworkID } from "src/lib/Bond"; // TODO: this type definition needs to move out of BOND.
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20Abi, provider);
    const ohmBalance = await ohmContract.balanceOf(address);
    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, ierc20Abi, provider);
    const sohmBalance = await sohmContract.balanceOf(address);
    let poolBalance = 0;
    const poolTokenContract = new ethers.Contract(addresses[networkID].PT_TOKEN_ADDRESS as string, ierc20Abi, provider);
    poolBalance = await poolTokenContract.balanceOf(address);

    return {
      balances: {
        ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
      },
    };
  },
);

interface IUserAccountDetails {
  balances: {
    dai: string;
    ohm: string;
    sohm: string;
  };
  staking: {
    ohmStake: number;
    ohmUnstake: number;
  };
  bonding: {
    daiAllowance: number;
  };
}

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {
    let ohmBalance = 0;
    let sohmBalance = 0;
    let fsohmBalance = 0;
    let wsohmBalance = 0;
    let stakeAllowance = 0;
    let unstakeAllowance = 0;
    let lpStaked = 0;
    let pendingRewards = 0;
    let lpBondAllowance = 0;
    let daiBondAllowance = 0;
    let aOHMAbleToClaim = 0;
    let poolBalance = 0;
    let poolAllowance = 0;
    let mintAllowance = 0;
    let epochsLeft = 0;
    let marketplaceCheezAllowance = 0;
    var deposit;
    let marketplaceNFTAllowance = false;
    let miceStakingAllowance = false;
    let catStakingAllowance = false;
    let trapStakingAllowance = false;
    let gameAllowance = false;
    let mintPassAllowance = false;
    let marketplacePassAllowance = false;

    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, ierc20Abi, provider);
    const daiBalance = await daiContract.balanceOf(address);
    const nftContract = new ethers.Contract(addresses[networkID].NFT_CONTRACT_ADDRESS as string, Minter, provider);
    const mouseBalance = await nftContract.balanceOf(address, 0)
    const catBalance = await nftContract.balanceOf(address, 1)
    const trapBalance = await nftContract.balanceOf(address, 2)
    const miceStakeContract = new ethers.Contract(addresses[networkID].MICE_STAKING_CONTRACT as string, LinearCheese, provider);
    const catStakeContract = new ethers.Contract(addresses[networkID].CAT_STAKING_CONTRACT as string, LinearCheese, provider);
    const trapStakeContract = new ethers.Contract(addresses[networkID].TRAP_STAKING_CONTRACT as string, LinearCheese, provider);
    const miceStakedBalance = await miceStakeContract.stakedTokens(address);
    const catStakedBalance = await catStakeContract.stakedTokens(address);
    const trapStakedBalance = await trapStakeContract.stakedTokens(address);
    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, sOHMv2, provider);
    const gameContract = new ethers.Contract(addresses[networkID].GAME_CONTRACT_ADDRESS as string, Game, provider)
    const cheezPassContract = new ethers.Contract(addresses[networkID].CHEEZPASS_CONTRACT_ADDRESS as string, Pass, provider)

    const getTimeStaked = await gameContract.getTimeStaked(address);
    const getStakedMice = await gameContract.getStaked(address, 0);
    const getStakedCats = await gameContract.getStaked(address, 1);
    const getStakedTraps = await gameContract.getStaked(address, 2);
    const getMouseIndex = await gameContract.getIndex(address, 0);
    const getCatIndex = await gameContract.getIndex(address, 1);
    const getClaimedMps = await cheezPassContract.getClaimedMps(address);
    const claimedReserves = await cheezPassContract.getClaimedReserves(address);
    const cheezPassBalance = await cheezPassContract.balanceOf(address, 0);
    
    const lastMice = await miceStakeContract.lastClaimed(address);
    const lastCat = await catStakeContract.lastClaimed(address);
    const lastTrap = await trapStakeContract.lastClaimed(address);

    const miceRewards = await gameContract.getRewards(address, 0);
    const catRewards = await gameContract.getRewards(address, 1);
    const nextGameRebase = await gameContract.nextRewardAt();

    const micePendingRewards = (1640529870 - parseInt(lastMice.toString())) * parseInt(miceStakedBalance.toString()) * 0.000001157
    const catPendingRewards = (1640529870 - parseInt(lastCat.toString())) * parseInt(catStakedBalance.toString()) * 0.000001157 * 3; 
    const trapPendingRewards = (1640529870 - parseInt(lastTrap.toString())) * parseInt(trapStakedBalance.toString())  * 0.000000578;
    
    if (addresses[networkID].OHM_ADDRESS) {
      const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20Abi, provider);
      ohmBalance = await ohmContract.balanceOf(address);
      stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
      mintAllowance = await ohmContract.allowance(address, addresses[networkID].NFT_CONTRACT_ADDRESS);
      mintPassAllowance = await ohmContract.allowance(address, addresses[networkID].CHEEZPASS_CONTRACT_ADDRESS);
      marketplaceCheezAllowance = await ohmContract.allowance(address, addresses[networkID].MARKETPLACE_ADDRESS)
    }

    if (addresses[networkID].NFT_CONTRACT_ADDRESS) {
      marketplaceNFTAllowance = await nftContract.isApprovedForAll(address, addresses[networkID].MARKETPLACE_ADDRESS);
      miceStakingAllowance = await nftContract.isApprovedForAll(address, addresses[networkID].MICE_STAKING_CONTRACT);
      catStakingAllowance = await nftContract.isApprovedForAll(address, addresses[networkID].CAT_STAKING_CONTRACT);
      trapStakingAllowance = await nftContract.isApprovedForAll(address, addresses[networkID].TRAP_STAKING_CONTRACT);
      gameAllowance = await nftContract.isApprovedForAll(address, addresses[networkID].GAME_CONTRACT_ADDRESS);
      marketplacePassAllowance = await cheezPassContract.isApprovedForAll(address, addresses[networkID].MARKETPLACE_ADDRESS);
    }

    if (addresses[networkID].SOHM_ADDRESS) {
      const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, sOHMv2, provider);
      sohmBalance = await sohmContract.balanceOf(address);
      unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
      poolAllowance = 0;
    }

    if (addresses[networkID].PT_TOKEN_ADDRESS) {
      const poolTokenContract = await new ethers.Contract(addresses[networkID].PT_TOKEN_ADDRESS, ierc20Abi, provider);
      poolBalance = await poolTokenContract.balanceOf(address);
    }

    for (const fuseAddressKey of ["FUSE_6_SOHM", "FUSE_18_SOHM"]) {
      if (addresses[networkID][fuseAddressKey]) {
        const fsohmContract = await new ethers.Contract(
          addresses[networkID][fuseAddressKey] as string,
          fuseProxy,
          provider,
        );
        fsohmContract.signer;
        const exchangeRate = ethers.utils.formatEther(await fsohmContract.exchangeRateStored());
        const balance = ethers.utils.formatUnits(await fsohmContract.balanceOf(address), "gwei");
        fsohmBalance += Number(balance) * Number(exchangeRate);
      }
    }

    if (addresses[networkID].WSOHM_ADDRESS) {
      const wsohmContract = new ethers.Contract(addresses[networkID].WSOHM_ADDRESS as string, wsOHM, provider);
      const balance = await wsohmContract.balanceOf(address);
      wsohmBalance = await wsohmContract.wOHMTosOHM(balance);
    }

    if(addresses[networkID].STAKING_ADDRESS) {
      const stakingContract = new ethers.Contract(addresses[networkID].STAKING_ADDRESS as string, stake, provider)
      const warmupInfo = await stakingContract.warmupInfo(address);
      const epoch = await stakingContract.epoch();
      const currentEpoch = parseInt(epoch.number.toString());
      deposit = await sohmContract.balanceForGons(warmupInfo.gons)
      epochsLeft = Math.max(0, parseInt(warmupInfo.expiry.toString()) - currentEpoch)
      console.log(epochsLeft)
    }


    return {
      balances: {
        dai: ethers.utils.formatEther(daiBalance),
        ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
        deposit: ethers.utils.formatUnits(deposit, 9),
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
        fsohm: fsohmBalance,
        wsohm: ethers.utils.formatUnits(wsohmBalance, "gwei"),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
        mouse: mouseBalance.toString(),
        cat: catBalance.toString(),
        trap: trapBalance.toString(),
        miceStakedBalance: miceStakedBalance.toString(),
        catStakedBalance: catStakedBalance.toString(),
        trapStakedBalance: trapStakedBalance.toString(),
        micePendingRewards: micePendingRewards.toString(),
        catPendingRewards: catPendingRewards.toString(),
        trapPendingRewards: trapPendingRewards.toString(),
      },
      staking: {
        ohmStake: +stakeAllowance,
        ohmUnstake: +unstakeAllowance,
        miceAllowance: miceStakingAllowance,
        catAllowance: catStakingAllowance,
        trapAllowance: trapStakingAllowance,
        epochsLeft: epochsLeft,
      },
      minting: {
        mintAllowance: mintAllowance,
        marketplaceCheezAllowance: marketplaceCheezAllowance,
        marketplaceNFTAllowance: marketplaceNFTAllowance,
        gameAllowance: gameAllowance,
        marketplacePassAllowance: marketplacePassAllowance,
      },
      pass: {
        cheezPassBalance: cheezPassBalance.toString(),
        mintPassAllowance: mintPassAllowance,
        claimedMps: getClaimedMps,
        claimedReserves: claimedReserves
      },
      bonding: {
        daiAllowance: daiBondAllowance,
      },
      pooling: {
        sohmPool: +poolAllowance,
      },
      game: {
        nextRewardAt: nextGameRebase.toString(),
        getTimeStaked: getTimeStaked.toString(),
        getStakedMice: getStakedMice.toString(),
        getStakedCats: getStakedCats.toString(),
        getStakedTraps: getStakedTraps.toString(),
        getMouseIndex: getMouseIndex.toString(),
        getCatIndex: getCatIndex.toString(),
        miceRewards: miceRewards.toString(),
        catRewards: catRewards.toString()
      }
    };
  },
);

export interface IUserBondDetails {
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
      };
    }
    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    let interestDue, pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = 0;
    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);
    // formatEthers takes BigNumber => String
    let balanceVal = ethers.utils.formatEther(balance);
    // balanceVal should NOT be converted to a number. it loses decimal precision
    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance: Number(allowance),
      balance: balanceVal,
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    };
  },
);

interface IAccountSlice {
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    ohm: string;
    sohm: string;
    dai: string;
    oldsohm: string;
  };
  loading: boolean;
}
const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { ohm: "", sohm: "", dai: "", oldsohm: "" },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
