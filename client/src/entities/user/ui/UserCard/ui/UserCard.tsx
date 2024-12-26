import React from 'react';
import { Avatar, Tooltip } from 'antd';
import type { UserType } from '@/entities/user/model';
import styles from './UserCard.module.css';
import { UserTooltipContent } from '../../UserTooltipContent';

type Props = {
  user: UserType;
};

export function UserCard({ user }: Props): React.JSX.Element {
  return (
    <div className={styles.container}>
      <Tooltip
        title={
          <UserTooltipContent
            firstName={user.firstName}
            lastName={user.lastName}
            email={user.email}
          />
        }
      >
        <Avatar size={64} src={user.avatarSrc} alt={`${user.firstName}'s avatar`} />
      </Tooltip>
    </div>
  );
}
