import { createSlice, PayloadAction, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import {RootState} from "../store";
import axios from "axios";
import { setAll } from "../helpers";
import {IGetMyAsyncThunk} from "./interfaces";

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

export const getMyListings = createAsyncThunk(
    'listings/getMyListings',
    async ({  admin }: IGetMyAsyncThunk) => {
    const resp = await axios.get(`https://api.cheesedao.xyz/apiv1/marketplace/listings/?admin=${admin}&sortBy=price&sort=ASC&page=0&pageSize=100&`);
    let data = resp.data;
    return data;
    })

export const myListingSlice = createSlice({
    name: 'myListing',
    initialState,
    reducers: {
        fetchListingSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
          .addCase(getMyListings.pending, state => {
          })
          .addCase(getMyListings.fulfilled, (state, action) => {
            setAll(state, action.payload);
          })
          .addCase(getMyListings.rejected, (state, { error }) => {
            console.error(error.name, error.message, error.stack);
          })
      },
})


export default myListingSlice.reducer;

export const { fetchListingSuccess } = myListingSlice.actions;

const baseInfo = (state: RootState) => state.myListing;

export const getListingState = createSelector(baseInfo, myListing => myListing);