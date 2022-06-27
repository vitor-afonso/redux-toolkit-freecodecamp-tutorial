// jshint esversion:9

//course-api.com/react/-useReducer-cart-project
import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { openModal } from '../modal/modalSlice';

const url = 'https://course-api.com/react-useReducer-cart-project';

//we set initialState as a separated object because we have more than one state to check
const initialState = {
  cartItems: [],
  amount: 0,
  total: 0,
  isLoading: true,
};

export const getCartItems = createAsyncThunk('cart/getCartItems', async (dataFromComponent, thunkAPI) => {
  try {
    //console.log('optional data from component =>', dataFromComponent);
    //console.log('thunkAPI =>', thunkAPI); // contains valious methods
    //console.log('all states in the app through thunkAPI =>', thunkAPI.getState());
    //thunkAPI.dispatch(openModal()); //thunkAPI.dispatch would allow us to call an action from another feature

    const res = await axios(url);
    return res.data; // we return a promise that is being handled by extraReducers in cartSlice
  } catch (error) {
    //return thunkAPI.rejectWithValue(error.response); // this would be handled by extraReducers getCartItems.rejected in cartSlice

    return thunkAPI.rejectWithValue('Something went wrong...'); // this is being handled by extraReducers getCartItems.rejected in cartSlice
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
    },
    increase: (state, action) => {
      const cartItem = state.cartItems.find((item) => item.id === action.payload);
      cartItem.amount = cartItem.amount + 1;
    },
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount - 1;
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total;
    },
  },
  extraReducers: {
    [getCartItems.pending]: (state) => {
      state.isLoading = true;
    },
    [getCartItems.fulfilled]: (state, action) => {
      /* console.log(action); */
      state.isLoading = false;
      state.cartItems = action.payload;
    },
    [getCartItems.rejected]: (state, action) => {
      //console.log(action);
      state.isLoading = false;
    },
  },
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;
