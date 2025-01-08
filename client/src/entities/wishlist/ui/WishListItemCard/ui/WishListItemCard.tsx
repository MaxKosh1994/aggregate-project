import styles from './WishListItemCard.module.css';
import type { WishlistItemType } from '@/entities/wishlist/model';
import React from 'react';
import { PriorityWidget } from '../../PriorityWidget';
import { LinksWidget } from '../../LinksWidget';
import { Slider } from '@/shared/ui/Slider';

type Props = {
  wishListItem: WishlistItemType;
};

export function WishListItemCard({ wishListItem }: Props): React.JSX.Element {
  const { title, priority, description, images, minPrice, maxPrice, links } = wishListItem;
  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <Slider images={images} />
      </div>
      <div className={styles.container}>
        <div className={styles.point}>
          <span>Название:</span>
          <span className={styles.title}>{title}</span>
        </div>

        <PriorityWidget priority={priority} />

        <div className={styles.point}>
          <span>Описание:</span>
          <span>{description}</span>
        </div>

        <div className={styles.point}>
          <span>Диапазон цен:</span>
          <span>
            {minPrice}р - {maxPrice}р
          </span>
        </div>

        <LinksWidget links={links} />
      </div>
    </div>
  );
}
