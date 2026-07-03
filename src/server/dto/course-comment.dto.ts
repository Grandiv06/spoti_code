import type { Comment } from "@prisma/client";

export interface CourseCommentListItemDto {
  id: string;
  content: string;
  comment: string;
  createdAt: string;
  date: string;
  rating?: number;
  parentId?: string;
  user: {
    id?: string;
    fullName: string;
    name: string;
    role: string;
    avatar: string;
  };
  authorName: string;
  reply?: {
    content: string;
    comment: string;
    createdAt: string;
    date: string;
    author: {
      fullName: string;
      name: string;
      role: string;
    };
    authorName: string;
  };
  replies?: CourseCommentListItemDto[];
}

export interface CourseCommentListMetaDto {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface CourseCommentListResponseDto {
  data: {
    items: CourseCommentListItemDto[];
    total: number;
    meta: CourseCommentListMetaDto;
  };
}

export interface CreateCourseCommentInputDto {
  content: string;
  commentableType: "course";
  commentableId: string;
  parentId?: string;
  rating?: number;
}

type CommentWithReplies = Comment & { replies: Comment[] };

function toCommentUser(comment: Comment) {
  return {
    id: comment.authorId ?? undefined,
    fullName: comment.authorName,
    name: comment.authorName,
    role: comment.authorRole,
    avatar: comment.authorAvatar,
  };
}

function toReplyDto(reply: Comment) {
  return {
    content: reply.content,
    comment: reply.content,
    createdAt: reply.createdAt.toISOString(),
    date: reply.createdAt.toISOString(),
    author: {
      fullName: reply.authorName,
      name: reply.authorName,
      role: reply.authorRole,
    },
    authorName: reply.authorName,
  };
}

export function toCourseCommentListItemDto(comment: CommentWithReplies): CourseCommentListItemDto {
  const instructorReply = comment.replies.find((item) => item.isInstructorReply) ?? comment.replies[0];

  return {
    id: comment.id,
    content: comment.content,
    comment: comment.content,
    createdAt: comment.createdAt.toISOString(),
    date: comment.createdAt.toISOString(),
    rating: comment.rating ?? undefined,
    parentId: comment.parentId ?? undefined,
    user: toCommentUser(comment),
    authorName: comment.authorName,
    reply: instructorReply ? toReplyDto(instructorReply) : undefined,
    replies: comment.replies.map((reply) => ({
      ...toCourseCommentListItemDto({ ...reply, replies: [] }),
    })),
  };
}
