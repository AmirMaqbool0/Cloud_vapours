import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedMethod: null,
  selectedDate: null,
  shippingOptions: [
    {
      id: 'free',
      name: 'Free Shipping',
      description: 'Regularly shipment',
      price: 0,
      deliveryDays: 15,
      isDefault: true
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Get your delivery as soon as possible',
      price: 8.50,
      deliveryDays: 3
    }
    // Schedule option will be handled separately
  ]
};

const shippingSlice = createSlice({
  name: 'shipping',
  initialState,
  reducers: {
    selectShippingMethod: (state, action) => {
      state.selectedMethod = action.payload.method;
      if (action.payload.date) {
        state.selectedDate = action.payload.date;
      }
    },
    selectDeliveryDate: (state, action) => {
      state.selectedDate = action.payload;
    }
  }
});

export const { selectShippingMethod, selectDeliveryDate } = shippingSlice.actions;

// Helper function to calculate delivery date
export const calculateDeliveryDate = (daysToAdd) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default shippingSlice.reducer;