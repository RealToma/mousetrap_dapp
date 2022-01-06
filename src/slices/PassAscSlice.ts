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

export const getPassListings = createAsyncThunk(
    'listings/getPassListings',
    async (listing, thunkAPI) => {
    const resp = await axios.get(`https://api.cheesedao.xyz/apiv1/marketplace/listings/?tokenId=${0}&sortBy=price&sort=ASC&page=0&pageSize=100&token=0x4175c4A80c13604D93b6BAfE90aBfc80ca37F718`);
    let data = resp.data;
    return data;
    })

export const passListingAscSlice = createSlice({
    name: 'passListings',
    initialState,
    reducers: {
        fetchListingSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
          .addCase(getPassListings.pending, state => {
          })
          .addCase(getPassListings.fulfilled, (state, action) => {
            setAll(state, action.payload);
          })
          .addCase(getPassListings.rejected, (state, { error }) => {
            console.error(error.name, error.message, error.stack);
          })
      },
})


export default passListingAscSlice.reducer;

export const { fetchListingSuccess } = passListingAscSlice.actions;

const baseInfo = (state: RootState) => state.passListings;

export const getListingState = createSelector(baseInfo, passListings => passListings);