// src/redux/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, image, price, flavor, nicotineStrength, puffCount } =
        action.payload;

      const existingItem = state.cartItems.find(
        (item) =>
          item.id === id &&
          item.flavor === flavor &&
          item.nicotineStrength === nicotineStrength
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({
          id,
          name,
          image,
          price,
          flavor,
          nicotineStrength,
          quantity: 1,
          puffCount,
        });
      }
    },

    // ✅ New: increase quantity
    increaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) =>
          item.id === action.payload.id &&
          item.flavor === action.payload.flavor &&
          item.nicotineStrength === action.payload.nicotineStrength
      );
      if (item) {
        item.quantity += 1;
      }
    },

    // ✅ New: decrease quantity
    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) =>
          item.id === action.payload.id &&
          item.flavor === action.payload.flavor &&
          item.nicotineStrength === action.payload.nicotineStrength
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    removeFromCart: (state, action) => {
      const { id, flavor, nicotineStrength } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) =>
          !(
            item.id === id &&
            item.flavor === flavor &&
            item.nicotineStrength === nicotineStrength
          )
      );
    },

    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
