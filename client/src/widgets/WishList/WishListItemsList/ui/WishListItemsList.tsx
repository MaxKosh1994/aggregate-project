import styles from './WishListItemsList.module.css';
import React from 'react';
import { useAppSelector } from '@/shared/hooks/reduxHooks';
import { WishListItemCard } from '@/entities/wishlist';

export function WishListItemsList(): React.JSX.Element {
  const { currentUserWishListItems } = useAppSelector((state) => state.wishlist);

  return (
    <section className={styles.container}>
      {currentUserWishListItems.length ? (
        currentUserWishListItems.map((el) => <WishListItemCard key={el.id} wishListItem={el} />)
      ) : (
        <h2>У этого пользователя пока нет желаний, он ничего не хочет</h2>
      )}
    </section>
  );
}
