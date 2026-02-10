import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addresses: [
    {
      id: 1,
      title: "2118 Thornridge",
      type: "HOME",
      address: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
      phone: "(209) 555-0104",
      isDefault: true
    },
    {
      id: 2,
      title: "Headoffice",
      type: "OFFICE",
      address: "2715 Ash Dr. San Jose, South Dakota 83475",
      phone: "(704) 555-0127",
      isDefault: false
    }
  ],
  selectedAddress: null
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    addAddress: (state, action) => {
      // If this is the first address, set it as default
      const isFirstAddress = state.addresses.length === 0;
      state.addresses.push({
        ...action.payload,
        isDefault: isFirstAddress
      });
      
      // If it's the first address, select it automatically
      if (isFirstAddress) {
        state.selectedAddress = action.payload;
      }
    },
    removeAddress: (state, action) => {
      const addressId = action.payload;
      state.addresses = state.addresses.filter(addr => addr.id !== addressId);
      
      // If we're removing the selected address, clear the selection
      if (state.selectedAddress?.id === addressId) {
        state.selectedAddress = null;
      }
      
      // If we removed the default address and there are other addresses, set a new default
      const wasDefault = state.addresses.some(addr => addr.id === addressId && addr.isDefault);
      if (wasDefault && state.addresses.length > 0) {
        state.addresses[0].isDefault = true;
      }
    },
    selectAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    updateAddress: (state, action) => {
      const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
        
        // If we're updating the selected address, update that too
        if (state.selectedAddress?.id === action.payload.id) {
          state.selectedAddress = action.payload;
        }
      }
    },
    setDefaultAddress: (state, action) => {
      const addressId = action.payload;
      state.addresses = state.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));
    }
  },
});

export const { 
  addAddress, 
  removeAddress, 
  selectAddress, 
  updateAddress,
  setDefaultAddress
} = addressSlice.actions;

export default addressSlice.reducer;