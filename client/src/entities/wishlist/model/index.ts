import type { CommentType } from '@/entities/comment';
import type { UserType } from '@/entities/user';

export type ImageType = {
  id: number;
  src: string;
  wishlistItemId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type LinkType = ImageType;

export type WishlistItemType = {
  id: number;
  title: string;
  description: string;
  maxPrice: number;
  minPrice: number;
  authorId: number;
  wishlistId: number;
  priority: 'не особо нужно' | 'было бы славно' | 'очень нужно' | 'душу продать';
  createdAt: Date;
  updatedAt: Date;
  owner: UserType;
  links: LinkType[];
  images: ImageType[];
  comments: CommentType[];
};

export type CreateWishListData = {
  title: string;
};

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
