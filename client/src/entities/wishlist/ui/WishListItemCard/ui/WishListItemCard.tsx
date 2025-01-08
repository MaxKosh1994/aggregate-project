import styles from './WishListItemCard.module.css';
import type { WishlistItemType } from '@/entities/wishlist/model';
import React from 'react';

type Props = {
  wishListItem: WishlistItemType;
};

export function WishListItemCard({ wishListItem }: Props): React.JSX.Element {
  return <div className={styles.container}>{wishListItem.title}</div>;
}
