import styles from './WishListItemCard.module.css';
import type { WishlistItemType } from '@/entities/wishlist/model';
import { Favicon } from '@/shared/ui/Favicon';
import React from 'react';

type Props = {
  wishListItem: WishlistItemType;
};

export function WishListItemCard({ wishListItem }: Props): React.JSX.Element {
  console.log(wishListItem);
  return (
    <div className={styles.container}>
      <div className={styles.point}>
        <span>Название:</span>
        <span className={styles.title}>{wishListItem.title}</span>
      </div>

      <div className={styles.point}>
        <span>Приоритет:</span>
        <span>{wishListItem.priority}</span>
      </div>

      <div className={styles.point}>
        <span>Описание:</span>
        <span>{wishListItem.description}</span>
      </div>

      <div className={styles.point}>
        <span>Диапазон цен:</span>
        <span>
          {wishListItem.minPrice}р - {wishListItem.maxPrice}р
        </span>
      </div>

      {wishListItem.links.map((el) => (
        <div key={el.src} className={styles.point}>
          <Favicon url={el.src} />
          <a href={el.src} target="_blank" rel="noopener noreferrer">
            ссылка
          </a>
        </div>
      ))}
    </div>
  );
}
