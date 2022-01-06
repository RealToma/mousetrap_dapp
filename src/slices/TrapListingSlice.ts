import { createSlice, PayloadAction, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import {RootState} from "../store";
import axios from "axios";
import { setAll } from "../helpers";

const initialState = {
};

interface TrapListing {
    _id: string;
    offerId: string;
    admin: string;
    token: number;
    tokenId: string;
    price: number;
    amount: number;
    deadline: string;
    created: string;
    __v: number;
}

export const getTrapListings = createAsyncThunk(
    'listings/getTrapListings',
    async (listing, thunkAPI) => {
    const resp = await axios.get(`https://api.cheesedao.xyz/apiv1/marketplace/listings/?tokenId=${2}&sortBy=price&sort=ASC&page=0&pageSize=100&token=0x4e9c30CbD786549878049f808fb359741BF721ea`);
    let data = resp.data;
    return data;
    })

export const trapListingSlice = createSlice({
    name: 'trapListings',
    initialState,
    reducers: {
        fetchListingSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
          .addCase(getTrapListings.pending, state => {
          })
          .addCase(getTrapListings.fulfilled, (state, action) => {
            setAll(state, action.payload);
          })
          .addCase(getTrapListings.rejected, (state, { error }) => {
            console.error(error.name, error.message, error.stack);
          })
      },
})


export default trapListingSlice.reducer;

export const { fetchListingSuccess } = trapListingSlice.actions;

const baseInfo = (state: RootState) => state.trapListings;

export const getListingState = createSelector(baseInfo, trapListings => trapListings);