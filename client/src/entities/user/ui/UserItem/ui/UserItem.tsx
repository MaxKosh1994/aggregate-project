import styles from './UserItem.module.css';
import React from 'react';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { UserCard, type UserType } from '@/entities/user';

type Props = {
  user: UserType;
  isOwner?: boolean;
  onDelete?: () => void;
};

export function UserItem({ user, isOwner = false, onDelete }: Props): React.JSX.Element {
  return (
    <div className={styles.userItem}>
      <UserCard user={user} />
      {isOwner && <span className={styles.owner}>Владелец</span>}
      {!isOwner && onDelete && (
        <Button type="primary" danger onClick={onDelete} icon={<DeleteOutlined />} />
      )}

      <span>{`${user.firstName} ${user.lastName}`}</span>
    </div>
  );
}
