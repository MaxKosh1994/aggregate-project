import { createSlice } from '@reduxjs/toolkit';

type ModalsState = {
  isModalSignInOpen: boolean;
  isModalSignUpOpen: boolean;
  isModalCreateWishlistOpen: boolean;
  isModalUpdateWishlistOpen: boolean;
  isModalDeleteWishlistOpen: boolean;
};

const initialState: ModalsState = {
  isModalSignInOpen: false,
  isModalSignUpOpen: false,
  isModalCreateWishlistOpen: false,
  isModalUpdateWishlistOpen: false,
  isModalDeleteWishlistOpen: false,
};

const modalSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    showModalSignIn: (state) => {
      state.isModalSignInOpen = true;
    },

    closeModalSignIn: (state) => {
      state.isModalSignInOpen = false;
    },

    showModalSignUp: (state) => {
      state.isModalSignUpOpen = true;
    },

    closeModalSignUp: (state) => {
      state.isModalSignUpOpen = false;
    },

    showModalCreateWishlist: (state) => {
      state.isModalCreateWishlistOpen = true;
    },

    closeModalCreateWishlist: (state) => {
      state.isModalCreateWishlistOpen = false;
    },

    showModalUpdateWishlist: (state) => {
      state.isModalUpdateWishlistOpen = true;
    },

    closeModalUpdateWishlist: (state) => {
      state.isModalUpdateWishlistOpen = false;
    },

    showModalDeleteWishlist: (state) => {
      state.isModalDeleteWishlistOpen = true;
    },

    closeModalDeleteWishlist: (state) => {
      state.isModalDeleteWishlistOpen = false;
    },
  },
});

export const {
  showModalSignIn,
  closeModalSignIn,
  showModalSignUp,
  closeModalSignUp,
  showModalCreateWishlist,
  closeModalCreateWishlist,
  showModalUpdateWishlist,
  closeModalUpdateWishlist,
  showModalDeleteWishlist,
  closeModalDeleteWishlist,
} = modalSlice.actions;
export default modalSlice.reducer;
