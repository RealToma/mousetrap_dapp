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

export const getHighestSales = createAsyncThunk(
    'listings/getHighestSales',
    async (listing, thunkAPI) => {
    const resp = await axios.get(`https://api.cheesedao.xyz/apiv1/marketplace/sellFeed/?page=0&pageSize=25&sortBy=created&sort=DSC&`);
    let data = resp.data;
    return data;
    })

export const highestSaleSlice = createSlice({
    name: 'highSales',
    initialState,
    reducers: {
        fetchListingSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
          .addCase(getHighestSales.pending, state => {
          })
          .addCase(getHighestSales.fulfilled, (state, action) => {
            setAll(state, action.payload);
          })
          .addCase(getHighestSales.rejected, (state, { error }) => {
            console.error(error.name, error.message, error.stack);
          })
      },
})


export default highestSaleSlice.reducer;

export const { fetchListingSuccess } = highestSaleSlice.actions;

const baseInfo = (state: RootState) => state.highSales;

export const getListingState = createSelector(baseInfo, highSales => highSales);