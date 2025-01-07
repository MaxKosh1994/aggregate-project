import styles from './WishListCard.module.css';
import React from 'react';
import { Button } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { WishListType } from '@/entities/wishlist';

type Props = {
  wishlist: WishListType;
  isOwned: boolean;
  onDelete?: () => void;
  onUpdate?: () => void;
};

export function WishListCard({ wishlist, isOwned, onDelete, onUpdate }: Props): React.JSX.Element {
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
      {isOwned && (
        <div className={styles.buttonsContainer}>
          {onDelete && (
            <Button type="primary" danger onClick={onDelete} icon={<DeleteOutlined />} />
          )}
          {onUpdate && <Button type="primary" onClick={onUpdate} icon={<EditOutlined />} />}
        </div>
      )}
    </div>
  );
}
