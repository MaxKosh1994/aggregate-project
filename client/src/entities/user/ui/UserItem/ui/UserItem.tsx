import styles from './UserItem.module.css';
import React from 'react';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { UserCard, type UserType } from '@/entities/user';

type Props = {
  user: UserType;
  isOwner?: boolean;
  onClick: () => void;
  onDelete?: () => void;
};

export function UserItem({ user, isOwner = false, onClick, onDelete }: Props): React.JSX.Element {
  return (
    <div className={styles.userItem}>
      <UserCard user={user} />

      <span className={styles.name} onClick={onClick}>{`${user.firstName} ${user.lastName}`}</span>
      {isOwner && <span className={styles.owner}>Владелец</span>}
      {!isOwner && onDelete && (
        <Button type="primary" danger onClick={onDelete} icon={<DeleteOutlined />} />
      )}
    </div>
  );
}
