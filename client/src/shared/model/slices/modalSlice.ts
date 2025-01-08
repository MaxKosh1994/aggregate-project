import { createSlice } from '@reduxjs/toolkit';

type ModalsState = {
  isModalSignInOpen: boolean;
  isModalSignUpOpen: boolean;
  isModalCreateWishlistOpen: boolean;
  isModalUpdateWishlistOpen: boolean;
  isModalDeleteWishlistOpen: boolean;
  isModalKickOutUserFromWishlistOpen: boolean;
  isModalInviteUserToWishlistOpen: boolean;
};

const initialState: ModalsState = {
  isModalSignInOpen: false,
  isModalSignUpOpen: false,
  isModalCreateWishlistOpen: false,
  isModalUpdateWishlistOpen: false,
  isModalDeleteWishlistOpen: false,
  isModalKickOutUserFromWishlistOpen: false,
  isModalInviteUserToWishlistOpen: false,
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

    showModalKickOutUserFromWishlist: (state) => {
      state.isModalKickOutUserFromWishlistOpen = true;
    },

    closeModalKickOutUserFromWishlist: (state) => {
      state.isModalKickOutUserFromWishlistOpen = false;
    },

    showModalInviteUserToWishlist: (state) => {
      state.isModalInviteUserToWishlistOpen = true;
    },

    closeModalInviteUserToWishlist: (state) => {
      state.isModalInviteUserToWishlistOpen = false;
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
  showModalKickOutUserFromWishlist,
  closeModalKickOutUserFromWishlist,
  showModalInviteUserToWishlist,
  closeModalInviteUserToWishlist,
} = modalSlice.actions;
export default modalSlice.reducer;
