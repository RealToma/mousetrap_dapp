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

export const getPassListingsDsc = createAsyncThunk(
    'listings/getPassListingsDsc',
    async (listing, thunkAPI) => {
    const resp = await axios.get(`https://api.cheesedao.xyz/apiv1/marketplace/listings/?tokenId=${0}&sortBy=price&sort=DSC&page=0&pageSize=100&token=0x4175c4A80c13604D93b6BAfE90aBfc80ca37F718`);
    let data = resp.data;
    return data;
    })

export const passListingsDscSlice = createSlice({
    name: 'passListingsDsc',
    initialState,
    reducers: {
        fetchListingSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
          .addCase(getPassListingsDsc.pending, state => {
          })
          .addCase(getPassListingsDsc.fulfilled, (state, action) => {
            setAll(state, action.payload);
          })
          .addCase(getPassListingsDsc.rejected, (state, { error }) => {
            console.error(error.name, error.message, error.stack);
          })
      },
})


export default passListingsDscSlice.reducer;

export const { fetchListingSuccess } = passListingsDscSlice.actions;

const baseInfo = (state: RootState) => state.passListingsDsc;

export const getListingState = createSelector(baseInfo, passListingsDsc => passListingsDsc);