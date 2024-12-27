import styles from './WishListsGroup.module.css';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { getAllUserWishListsThunk, WishListCard } from '@/entities/wishlist';

export function WishListsGroup(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const wishlists = useAppSelector((state) => state.wishlist.wishlists);
  const { user } = useAppSelector((state) => state.user);

  const extendedWishlists = wishlists.map((el) =>
    el.ownerId === user?.id ? { ...el, isOwned: true } : { ...el, isOwned: false },
  );

  useEffect(() => {
    void dispatch(getAllUserWishListsThunk()).unwrap();
  }, [dispatch]);
  return (
    <div className={styles.container}>
      {extendedWishlists.map((el) => (
        <WishListCard key={el.id} wishlist={el} isOwned={el.isOwned} />
      ))}
    </div>
  );
}
