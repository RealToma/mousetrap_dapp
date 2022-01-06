import { createSlice, PayloadAction, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import {RootState} from "../store";
import axios from "axios";
import { setAll } from "../helpers";

const initialState = {
};

interface CatListing {
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

export const getCatListingsDsc = createAsyncThunk(
    'listings/getCatDscListings',
    async (listing, thunkAPI) => {
    const resp = await axios.get(`https://api.cheesedao.xyz/apiv1/marketplace/listings/?tokenId=${1}&sortBy=price&sort=DSC&page=0&pageSize=100&token=0x4e9c30CbD786549878049f808fb359741BF721ea`);
    let data = resp.data;
    return data;
    })

export const catListingDscSlice = createSlice({
    name: 'catListingsDsc',
    initialState,
    reducers: {
        fetchListingSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
          .addCase(getCatListingsDsc.pending, state => {
          })
          .addCase(getCatListingsDsc.fulfilled, (state, action) => {
            setAll(state, action.payload);
          })
          .addCase(getCatListingsDsc.rejected, (state, { error }) => {
            console.error(error.name, error.message, error.stack);
          })
      },
})


export default catListingDscSlice.reducer;

export const { fetchListingSuccess } = catListingDscSlice.actions;

const baseInfo = (state: RootState) => state.catListingsDsc;

export const getListingState = createSelector(baseInfo, catDscListings => catDscListings);