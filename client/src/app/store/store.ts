import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from '@/entities/user';
import { wishlistReducer } from '@/entities/wishlist';

const store = configureStore({
  reducer: {
    user: userReducer,
    wishlist: wishlistReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
