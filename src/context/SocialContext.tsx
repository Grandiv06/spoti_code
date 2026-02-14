"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SocialUser, SocialPost, SocialComment, PostVisibility } from '@/types/social';
import { useAuth } from './AuthContext';

// --- Seed Data Generators ---

const MOCK_USERS: SocialUser[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `user-${i + 1}`,
  username: `user_${i + 1}`,
  displayName: i === 0 ? "سروش مشایخی" : `کاربر نمونه ${i + 1}`,
  avatarUrl: `https://i.pravatar.cc/150?u=user-${i + 1}`,
  bio: "عاشق برنامه‌نویسی و توسعه وب. همیشه در حال یادگیری تکنولوژی‌های جدید.",
  createdAt: new Date().toISOString(),
  followersCount: Math.floor(Math.random() * 1000),
  followingCount: Math.floor(Math.random() * 500),
  postsCount: Math.floor(Math.random() * 20),
}));

const TECH_TAGS = ["React", "Next.js", "TypeScript", "TailwindCSS", "Node.js", "Python", "Go", "Rust", "Vue", "Angular"];

const MOCK_POSTS: SocialPost[] = Array.from({ length: 30 }).map((_, i) => {
  const author = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
  return {
    id: `post-${i + 1}`,
    authorId: author.id,
    author: author,
    title: `پروژه نمونه شماره ${i + 1}: ${TECH_TAGS[i % TECH_TAGS.length]}`,
    summary: "این یک توضیح کوتاه درباره پروژه است که در کارت نمایش داده می‌شود.",
    description: "این توضیحات کامل پروژه است. شامل جزئیات فنی، چالش‌ها و نحوه پیاده‌سازی. \n\n لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
    tags: [TECH_TAGS[i % TECH_TAGS.length], "Web", "OpenSource"],
    coverImageUrl: `https://picsum.photos/seed/${i + 1}/800/400`,
    galleryImageUrls: [`https://picsum.photos/seed/${i + 100}/800/400`, `https://picsum.photos/seed/${i + 200}/800/400`],
    visibility: 'PUBLIC',
    viewsCount: Math.floor(Math.random() * 5000),
    likesCount: Math.floor(Math.random() * 500),
    commentsCount: Math.floor(Math.random() * 50),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    updatedAt: new Date().toISOString(),
    isDraft: false,
    isLikedByCurrentUser: false,
    isBookmarkedByCurrentUser: false,
  };
});

// --- Context Definition ---

interface SocialContextType {
  // Data
  currentUser: SocialUser | null;
  posts: SocialPost[];
  users: SocialUser[];
  
  // Actions
  toggleAuth: () => void;
  getPostById: (id: string) => SocialPost | undefined;
  getUserById: (id: string) => SocialUser | undefined;
  getUserPosts: (userId: string) => SocialPost[];
  createPost: (post: Omit<SocialPost, 'id' | 'author' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'likesCount' | 'commentsCount'>) => void;
  updatePost: (id: string, updates: Partial<SocialPost>) => void;
  deletePost: (id: string) => void;
  
  // Interactions
  likePost: (postId: string) => void;
  bookmarkPost: (postId: string) => void;
  followUser: (userId: string) => void;
  
  // Search/Filter
  searchPosts: (query: string, tag?: string) => SocialPost[];
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

function authToSocialUser(auth: { id: string; displayName: string; avatarUrl?: string }): SocialUser {
  return {
    id: auth.id,
    username: auth.id.replace(/-/g, '_'),
    displayName: auth.displayName,
    avatarUrl: auth.avatarUrl || `https://i.pravatar.cc/150?u=${auth.id}`,
    bio: "عضو اسپاتی هاب",
    createdAt: new Date().toISOString(),
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
  };
}

export const SocialProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser } = useAuth();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [users, setUsers] = useState<SocialUser[]>([]);

  const currentUser: SocialUser | null = authUser ? authToSocialUser(authUser) : null;

  useEffect(() => {
    setUsers(MOCK_USERS);
    const sortedPosts = [...MOCK_POSTS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setPosts(sortedPosts);
  }, []);

  const toggleAuth = () => {
    // No-op: auth is now managed by AuthContext
  };

  const getPostById = (id: string) => posts.find(p => p.id === id);
  const getUserById = (id: string) => {
    if (currentUser && currentUser.id === id) return currentUser;
    return users.find(u => u.id === id);
  };
  const getUserPosts = (userId: string) => posts.filter(p => p.authorId === userId);

  const createPost = (newPostData: Omit<SocialPost, 'id' | 'author' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'likesCount' | 'commentsCount'>) => {
    if (!currentUser) return;
    
    const newPost: SocialPost = {
      ...newPostData,
      id: `post-${Date.now()}`,
      author: currentUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewsCount: 0,
      likesCount: 0,
      commentsCount: 0,
      isLikedByCurrentUser: false,
      isBookmarkedByCurrentUser: false,
    };
    
    setPosts(prev => [newPost, ...prev]);
  };

  const updatePost = (id: string, updates: Partial<SocialPost>) => {
     setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  };
  
  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const likePost = (postId: string) => {
    // If guest, this should be blocked at UI level, but context handles logic
    if (!currentUser) return;

    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const isLiked = !p.isLikedByCurrentUser;
      return {
        ...p,
        isLikedByCurrentUser: isLiked,
        likesCount: p.likesCount + (isLiked ? 1 : -1),
      };
    }));
  };

  const bookmarkPost = (postId: string) => {
    if (!currentUser) return;
    setPosts(prev => prev.map(p => {
        if (p.id !== postId) return p;
        return { ...p, isBookmarkedByCurrentUser: !p.isBookmarkedByCurrentUser };
    }));
  };

  const followUser = (userId: string) => {
     // Mock implementation - in real app would update specific follow relationship
     if (!currentUser) return;
     if (userId === currentUser.id) return; // Cannot follow self
     
     // Optimistically toggle (no real persistence here for follows on other users in this simple mock)
     // But we could update 'users' state if we added 'isFollowedByCurrentUser' to SocialUser
     console.log(`Toggled follow for user ${userId}`);
  };

  const searchPosts = (query: string, tag?: string) => {
    return posts.filter(p => {
      const matchesQuery = query 
        ? (p.title.includes(query) || p.description.includes(query) || p.author.displayName.includes(query))
        : true;
      const matchesTag = tag ? p.tags.includes(tag) : true;
      const isPublic = p.visibility === 'PUBLIC' || (currentUser && p.authorId === currentUser.id); // Only show public unless owner
      
      return matchesQuery && matchesTag && isPublic;
    });
  };

  return (
    <SocialContext.Provider value={{
      currentUser,
      posts,
      users,
      toggleAuth,
      getPostById,
      getUserById,
      getUserPosts,
      createPost,
      updatePost,
      deletePost,
      likePost,
      bookmarkPost,
      followUser,
      searchPosts,
    }}>
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (context === undefined) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};
