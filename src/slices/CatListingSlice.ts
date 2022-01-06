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

export const getCatListings = createAsyncThunk(
    'listings/getCatListings',
    async (listing, thunkAPI) => {
    const resp = await axios.get(`https://api.cheesedao.xyz/apiv1/marketplace/listings/?tokenId=${1}&sortBy=price&sort=ASC&page=0&pageSize=100&token=0x4e9c30CbD786549878049f808fb359741BF721ea`);
    let data = resp.data;
    return data;
    })

export const catListingSlice = createSlice({
    name: 'catListings',
    initialState,
    reducers: {
        fetchListingSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
          .addCase(getCatListings.pending, state => {
          })
          .addCase(getCatListings.fulfilled, (state, action) => {
            setAll(state, action.payload);
          })
          .addCase(getCatListings.rejected, (state, { error }) => {
            console.error(error.name, error.message, error.stack);
          })
      },
})


export default catListingSlice.reducer;

export const { fetchListingSuccess } = catListingSlice.actions;

const baseInfo = (state: RootState) => state.catListings;

export const getListingState = createSelector(baseInfo, catListings => catListings);
