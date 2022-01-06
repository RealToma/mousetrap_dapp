import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as OlympusStakingv2 } from "../abi/OlympusStakingv2.json";
import { abi as IERC20 } from "../abi/IERC20.json";
import { abi as Minter } from "../abi/Minter.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as OHMv2 } from "../abi/IERC20.json";
import { abi as Rebaser } from "../abi/Rebaser.json";
import { abi as CircABI } from "../abi/OHMCirculatingSupplyContract.json";
import { abi as Game } from "../abi/Game.json";
import { abi as Pass } from "../abi/Pass.json";
import { setAll, getTokenPrice, getMarketPrice } from "../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAsyncThunk } from "./interfaces";

const initialState = {
  loading: false,
  loadingMarketPrice: false,
};

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    let marketPrice;
    try {
      const originalPromiseResult = await dispatch(
        loadMarketPrice({ networkID: networkID, provider: provider }),
      ).unwrap();
        marketPrice = await getMarketPrice({ networkID, provider });
        marketPrice = marketPrice / Math.pow(10, 9);
    } catch (rejectedValueOrSerializedError) {
      // handle error here
      console.error("Returned a null response from dispatch(loadMarketPrice)");
      marketPrice = await getTokenPrice("cheesedao");
      return;
    }

    const cheezMainContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, OHMv2, provider)
    const scheezMainContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, sOHMv2, provider);
    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, IERC20, provider)
    const fraxContract = new ethers.Contract(addresses[networkID].FRAX_ADDRESS as string, IERC20, provider)
    const cirContract = new ethers.Contract(addresses[networkID].CIRC_SUPPLY_ADDRESS as string, CircABI, provider)
    const nftContract = new ethers.Contract(addresses[networkID].NFT_CONTRACT_ADDRESS as string, Minter, provider);
    const miceRebaseContract = new ethers.Contract(addresses[networkID].MICE_REBASE_ADDRESS as string, Rebaser, provider);
    const gameContract = new ethers.Contract(addresses[networkID].GAME_CONTRACT_ADDRESS as string, Game, provider)
    const cheezPassContract = new ethers.Contract(addresses[networkID].CHEEZPASS_CONTRACT_ADDRESS as string, Pass, provider)

    const passTotalSupply = (await cheezPassContract.totalSupply(0)).toString()
    const passAvailable = "0"

    const nextCatPool = parseFloat(ethers.utils.formatUnits(await gameContract.nextCatPool(), 9).toString()).toFixed(3)
    const miceInMazeBig = await nftContract.balanceOf(addresses[networkID].GAME_CONTRACT_ADDRESS, 0);
    const miceInMaze = miceInMazeBig.toString()
    const catsInMaze = (await nftContract.balanceOf(addresses[networkID].GAME_CONTRACT_ADDRESS, 1)).toString();
    const trapsInMaze = (await nftContract.balanceOf(addresses[networkID].GAME_CONTRACT_ADDRESS, 2)).toString();
    const miceIndex = ethers.BigNumber.from("1000000000")
    const miceCircGwei = miceInMazeBig.mul(miceIndex);
    const miceCirc = parseInt(ethers.utils.formatUnits(miceCircGwei, "gwei").toString());
    const nextMiceReward = (600 / miceCirc).toFixed(3)

    
    const miceMinted = 7000 - parseInt((await nftContract.NFTs(0)).maxSupply.toString())
    const catsMinted = 3000 - parseInt((await nftContract.NFTs(1)).maxSupply.toString())

    const cheezTotalSupply = await cheezMainContract.totalSupply()
    const cheezFinalSupply = cheezTotalSupply.toString()
    const scheezTotal = await scheezMainContract.circulatingSupply()
    const scheezFinalSupply = scheezTotal.toString()
    const cheezCirculatingSupply = (await cirContract.OHMCirculatingSupply()).toString()

    
    const miceStaked = (await nftContract.balanceOf(addresses[networkID].MICE_STAKING_CONTRACT, 0)).toString()
    const catsStaked = (await nftContract.balanceOf(addresses[networkID].CAT_STAKING_CONTRACT, 1)).toString()
    const trapsStaked = (await nftContract.balanceOf(addresses[networkID].TRAP_STAKING_CONTRACT, 2)).toString()

    const stakedAmount = parseInt(ethers.utils.formatUnits(scheezFinalSupply, 9))
    const stakingTVL = parseInt(ethers.utils.formatUnits(scheezFinalSupply, 9)) * marketPrice
    const circSupply = parseInt(ethers.utils.formatUnits(parseInt(cheezCirculatingSupply), 9))
    const totalSupply = parseInt(ethers.utils.formatUnits(parseInt(cheezFinalSupply), 9))
    const daiBalance = await daiContract.balanceOf(addresses[networkID].TREASURY_ADDRESS)
    const fraxBalance = await fraxContract.balanceOf(addresses[networkID].TREASURY_ADDRESS)
    const tempTreasury = daiBalance.add(fraxBalance)

    const treasuryMarketValue = parseInt(ethers.utils.formatUnits(tempTreasury.toString(), 18)) + 750000
    const marketCap = circSupply * marketPrice
    // const currentBlock = parseFloat(graphData.data._meta.block.number);
    if (!provider) {
      console.error("failed to connect to provider, please connect your wallet");
      return {
        stakingTVL,
        marketPrice,
        marketCap,
        circSupply,
        totalSupply,
        treasuryMarketValue,
      };
    }
    const currentBlock = await provider.getBlockNumber();

    const stakingContract = new ethers.Contract(
      addresses[networkID].STAKING_ADDRESS as string,
      OlympusStakingv2,
      provider,
    );
    // Calculating staking
    const epoch = await stakingContract.epoch();
    const stakingReward = epoch.distribute;
    const circ = await scheezMainContract.circulatingSupply()
    const stakingRebase = stakingReward / circ;
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

    let nextEpochRebase_number = Number.parseFloat(stakingRebase.toString())
    let runwayCurrent_num = (Math.log(treasuryMarketValue/parseInt(ethers.utils.formatUnits(circ.toString(), 9))) / Math.log(1+nextEpochRebase_number))/3;
    const runway = runwayCurrent_num;

    // Current index
    const currentIndex = await stakingContract.index();

    return {
      currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
      currentBlock,
      fiveDayRate,
      stakingAPY,
      stakingTVL,
      stakedAmount,
      stakingRebase,
      marketCap,
      marketPrice,
      circSupply,
      totalSupply,
      treasuryMarketValue,
      runway,
      miceMinted,
      catsMinted,
      miceStaked,
      catsStaked,
      trapsStaked,
      nextMiceReward,
      miceInMaze,
      catsInMaze,
      trapsInMaze,
      nextCatPool,
      passTotalSupply,
      passAvailable
    } as IAppData;
  },
);

/**
 * checks if app.slice has marketPrice already
 * if yes then simply load that state
 * if no then fetches via `loadMarketPrice`
 *
 * `usage`:
 * ```
 * const originalPromiseResult = await dispatch(
 *    findOrLoadMarketPrice({ networkID: networkID, provider: provider }),
 *  ).unwrap();
 * originalPromiseResult?.whateverValue;
 * ```
 */
export const findOrLoadMarketPrice = createAsyncThunk(
  "app/findOrLoadMarketPrice",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch, getState }) => {
    const state: any = getState();
    let marketPrice;
    // check if we already have loaded market price
    if (state.app.loadingMarketPrice === false && state.app.marketPrice) {
      // go get marketPrice from app.state
      marketPrice = state.app.marketPrice;
    } else {
      // we don't have marketPrice in app.state, so go get it
      try {
        const originalPromiseResult = await dispatch(
          loadMarketPrice({ networkID: networkID, provider: provider }),
        ).unwrap();
        marketPrice = originalPromiseResult?.marketPrice;
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        console.error("Returned a null response from dispatch(loadMarketPrice)");
        return;
      }
    }
    return { marketPrice };
  },
);

/**
 * - fetches the OHM price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from cheez-dai contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk("app/loadMarketPrice", async ({ networkID, provider }: IBaseAsyncThunk) => {
  let marketPrice: number;
  try {
    marketPrice = await getMarketPrice({ networkID, provider });
    marketPrice = marketPrice / Math.pow(10, 9);
  } catch (e) {
    marketPrice = await getTokenPrice("cheesedao");
    console.log("error: ", e)
  }
  return { marketPrice };
});

interface IAppData {
  readonly circSupply: number;
  readonly currentIndex?: string;
  readonly currentBlock?: number;
  readonly fiveDayRate?: number;
  readonly marketCap: number;
  readonly marketPrice: number;
  readonly stakingAPY?: number;
  readonly stakingRebase?: number;
  readonly stakingTVL: number;
  readonly totalSupply: number;
  readonly treasuryBalance?: number;
  readonly treasuryMarketValue?: number;
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadMarketPrice.pending, (state, action) => {
        state.loadingMarketPrice = true;
      })
      .addCase(loadMarketPrice.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingMarketPrice = false;
      })
      .addCase(loadMarketPrice.rejected, (state, { error }) => {
        state.loadingMarketPrice = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
