import type { UserType } from '@/entities/user';
import type { WishlistItemType } from '@/entities/wishlistItem';

export type WishListType = {
  id: number;
  title: string;
  backgroundPictureSrc: string;
  ownerId: number;
  owner: UserType;
  invitedUsers: UserType[];
  wishlistItems: WishlistItemType[];
  createdAt: Date;
  updatedAt: Date;
};
