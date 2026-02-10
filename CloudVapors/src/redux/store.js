import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import addressReducer from "./addressSlice";
import shippingReducer from "./shippingSlice";
import { saveState, loadState } from "./storage";
import userSliceReducer from "./userSlice";
const persistedState = loadState();

const store = configureStore({
  reducer: {
    cart: cartReducer,
    address: addressReducer,
    shipping: shippingReducer,
    user: userSliceReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState({
    cart: store.getState().cart,
    address: store.getState().address,
    shipping: store.getState().shipping,
    user: store.getState().user,
  });
});

export default store;
