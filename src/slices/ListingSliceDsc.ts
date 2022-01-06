import { createSlice, PayloadAction, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import {RootState} from "../store";
import axios from "axios";
import { setAll } from "../helpers";

const initialState = {
};

interface Listing {
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

export const getListingsDsc = createAsyncThunk(
    'listings/getListingsDsc',
    async (listing, thunkAPI) => {
    const resp = await axios.get(`https://api.cheesedao.xyz/apiv1/marketplace/listings/?tokenId=${0}&sortBy=price&sort=DSC&page=0&pageSize=100&token=0x4e9c30CbD786549878049f808fb359741BF721ea`);
    let data = resp.data;
    return data;
    })

export const listingDscSlice = createSlice({
    name: 'listingsDsc',
    initialState,
    reducers: {
        fetchListingSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
          .addCase(getListingsDsc.pending, state => {
          })
          .addCase(getListingsDsc.fulfilled, (state, action) => {
            setAll(state, action.payload);
          })
          .addCase(getListingsDsc.rejected, (state, { error }) => {
            console.error(error.name, error.message, error.stack);
          })
      },
})


export default listingDscSlice.reducer;

export const { fetchListingSuccess } = listingDscSlice.actions;

const baseInfo = (state: RootState) => state.listingsDsc;

export const getListingDscState = createSelector(baseInfo, listingsDsc => listingsDsc);