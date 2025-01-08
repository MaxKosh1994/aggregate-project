import styles from './WishListItemsList.module.css';
import React from 'react';
import { useAppSelector } from '@/shared/hooks/reduxHooks';
import { WishListItemCard } from '@/entities/wishlist';

export function WishListItemsList(): React.JSX.Element {
  const { currentUserWishListItems } = useAppSelector((state) => state.wishlist);
  console.log(currentUserWishListItems);
  return (
    <section className={styles.container}>
      {currentUserWishListItems.map((el) => (
        <WishListItemCard key={el.id} wishListItem={el} />
      ))}
    </section>
  );
}
