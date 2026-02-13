export type SocialUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  links?: {
    website?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  createdAt: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
};

export type PostVisibility = 'PUBLIC' | 'UNLISTED' | 'PRIVATE';

export type SocialPost = {
  id: string;
  authorId: string;
  author: SocialUser; // Denormalized for easier UI rendering
  title: string;
  summary: string;
  description: string;
  demoUrl?: string;
  githubUrl?: string;
  tags: string[];
  coverImageUrl?: string;
  galleryImageUrls: string[];
  visibility: PostVisibility;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  isDraft?: boolean;
  // Local user state (optimistic UI)
  isLikedByCurrentUser?: boolean;
  isBookmarkedByCurrentUser?: boolean;
};

export type SocialComment = {
  id: string;
  postId: string;
  authorId: string;
  author: SocialUser;
  content: string;
  parentCommentId?: string; // For nested replies
  replies?: SocialComment[]; // Nested structure for UI
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  isLikedByCurrentUser?: boolean;
};

export type SocialNotification = {
  id: string;
  userId: string;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION';
  actorId: string;
  actor: SocialUser;
  entityId?: string; // ID of the post or comment
  entityType?: 'POST' | 'COMMENT';
  isRead: boolean;
  createdAt: string;
};

// Application State / Concept of "Current User"
export type CurrentUserContextType = {
  user: SocialUser | null; // null = Guest
  isAuthenticated: boolean;
  toggleAuth: () => void; // For simulation/debugging
};
