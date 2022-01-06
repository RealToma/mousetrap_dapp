import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slices/AccountSlice";
import bondingReducer from "./slices/BondSlice";
import appReducer from "./slices/AppSlice";
import pendingTransactionsReducer from "./slices/PendingTxnsSlice";
import poolDataReducer from "./slices/PoolThunk";
import messagesReducer from "./slices/MessagesSlice";
import listingReducer from "./slices/ListingSlice";
import catListingReducer from "./slices/CatListingSlice";
import trapListingReducer from "./slices/TrapListingSlice";
import mouseListingsDscReducer from "./slices/ListingSliceDsc";
import catListingsDscReducer from "./slices/CatListingSliceDsc";
import trapListingsDscReducer from "./slices/TrapListingSliceDsc";
import myListingReducer from "./slices/MyListing";
import highestSaleReducer from "./slices/HighestSaleSlice";
import passListingReducer from "./slices/PassAscSlice";
import passListingsDscReducer from "./slices/PassDscSlice";
// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

const store = configureStore({
  reducer: {
    //   we'll have state.account, state.bonding, etc, each handled by the corresponding
    // reducer imported from the slice file
    account: accountReducer,
    bonding: bondingReducer,
    app: appReducer,
    pendingTransactions: pendingTransactionsReducer,
    poolData: poolDataReducer,
    messages: messagesReducer,
    listings: listingReducer,
    catListings: catListingReducer,
    trapListings: trapListingReducer,
    listingsDsc: mouseListingsDscReducer,
    catListingsDsc: catListingsDscReducer,
    trapListingsDsc: trapListingsDscReducer,
    myListing: myListingReducer,
    highSales: highestSaleReducer,
    passListings: passListingReducer,
    passListingsDsc: passListingsDscReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
