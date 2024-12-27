import styles from './WishListCard.module.css';
import React from 'react';
import type { WishListType } from '@/entities/wishlist';

type Props = {
  wishlist: WishListType;
  isOwned: boolean;
};

export function WishListCard({ wishlist, isOwned }: Props): React.JSX.Element {
  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${import.meta.env.VITE_IMAGES}/${wishlist.backgroundPictureSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: isOwned ? '1px solid green !important' : '',
      }}
    >
      <div className={styles.content}>
        <h3>{wishlist.title}</h3>
      </div>
    </div>
  );
}
