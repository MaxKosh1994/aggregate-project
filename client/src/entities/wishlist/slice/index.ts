import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import type { WishListType } from '../model';
import {
  getAllUserWishListsThunk,
  getUserWishListByIdThunk,
  createWishListThunk,
  updateWishListByIdThunk,
  deleteWishListByIdThunk,
  inviteUserToWishListThunk,
  kickOutUserToWishListThunk,
} from '../api';

type WishListState = {
  wishlists: WishListType[] | [];
  currentWishlist: WishListType | null;
  error: string | null;
  loading: boolean;
};

const initialState: WishListState = {
  wishlists: [],
  currentWishlist: null,
  error: null,
  loading: false,
};

const wishlistSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentWishlist: (state, action) => {
      state.currentWishlist =
        state.wishlists.find((el) => el.id === action.payload) ?? state.wishlists[0];
    },
  },
  extraReducers: (builder) => {
    builder
      //* getAllUserWishListsThunk
      .addCase(getAllUserWishListsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUserWishListsThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        const [firstWishlist] = data;
        state.loading = false;
        state.wishlists = data;
        state.currentWishlist = firstWishlist;
        state.error = null;
      })
      .addCase(getAllUserWishListsThunk.rejected, (state, action) => {
        state.loading = false;
        state.wishlists = [];
        state.error = action.payload!.error;
      })

      //* getUserWishListByIdThunk
      .addCase(getUserWishListByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserWishListByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWishlist = action.payload.data;
        state.error = null;
      })
      .addCase(getUserWishListByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.currentWishlist = null;
        state.error = action.payload!.error;
        message.error(action.payload!.error);
      })

      //* createWishListThunk
      .addCase(createWishListThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createWishListThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists = [...state.wishlists, action.payload.data];
        state.currentWishlist = action.payload.data;
        message.success(action.payload.message);
        state.error = null;
      })
      .addCase(createWishListThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!.error;
        message.error(action.payload!.error);
      })

      //* updateWishListByIdThunk
      .addCase(updateWishListByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateWishListByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists = state.wishlists.map((el) =>
          el.id === action.payload.data.id ? action.payload.data : el,
        );
        state.currentWishlist = action.payload.data;
        message.success(action.payload.message);
        state.error = null;
      })
      .addCase(updateWishListByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!.error;
        message.error(action.payload!.error);
      })

      //* updateWishListByIdThunk
      .addCase(inviteUserToWishListThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(inviteUserToWishListThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists = state.wishlists.map((el) =>
          el.id === action.payload.data.id ? action.payload.data : el,
        );
        state.currentWishlist = action.payload.data;
        message.success(action.payload.message);
        state.error = null;
      })
      .addCase(inviteUserToWishListThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!.error;
        message.error(action.payload!.error);
      })

      //* kickOutUserToWishListThunk
      .addCase(kickOutUserToWishListThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(kickOutUserToWishListThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists = state.wishlists.map((el) =>
          el.id === action.payload.data.id ? action.payload.data : el,
        );
        state.currentWishlist = action.payload.data;
        message.success(action.payload.message);
        state.error = null;
      })
      .addCase(kickOutUserToWishListThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!.error;
        message.error(action.payload!.error);
      })

      //* deleteWishListByIdThunk
      .addCase(deleteWishListByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteWishListByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists = state.wishlists.filter((el) => el.id !== action.payload.data.id);
        message.success(action.payload.message);
        state.currentWishlist = null;
        state.error = null;
      })
      .addCase(deleteWishListByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!.error;
        message.error(action.payload!.error);
      });
  },
});

export const { setCurrentWishlist } = wishlistSlice.actions;
export const wishlistReducer = wishlistSlice.reducer;
