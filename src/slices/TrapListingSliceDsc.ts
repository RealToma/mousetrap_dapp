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

export const getTrapListingsDsc = createAsyncThunk(
    'listings/getTrapDscListings',
    async (listing, thunkAPI) => {
    const resp = await axios.get(`https://api.cheesedao.xyz/apiv1/marketplace/listings/?tokenId=${2}&sortBy=price&sort=DSC&page=0&pageSize=100&token=0x4e9c30CbD786549878049f808fb359741BF721ea`);
    let data = resp.data;
    return data;
    })

export const trapListingDscSlice = createSlice({
    name: 'trapListings',
    initialState,
    reducers: {
        fetchListingSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
          .addCase(getTrapListingsDsc.pending, state => {
          })
          .addCase(getTrapListingsDsc.fulfilled, (state, action) => {
            setAll(state, action.payload);
          })
          .addCase(getTrapListingsDsc.rejected, (state, { error }) => {
            console.error(error.name, error.message, error.stack);
          })
      },
})


export default trapListingDscSlice.reducer;

export const { fetchListingSuccess } = trapListingDscSlice.actions;

const baseInfo = (state: RootState) => state.trapListingsDsc;

export const getListingState = createSelector(baseInfo, trapListingsDsc => trapListingsDsc);