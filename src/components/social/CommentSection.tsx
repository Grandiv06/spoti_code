"use client";

import React, { useState } from 'react';
import { SocialComment } from '@/types/social';
import { useSocial } from '@/context/SocialContext';
import { Avatar } from './Avatar';
import { SocialButton } from './SocialButton';
import { Heart, CornerDownRight, MoreHorizontal, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { useToast } from '@/components/ui/use-toast';

interface CommentItemProps {
  comment: SocialComment;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, depth = 0 }) => {
  const { currentUser } = useSocial();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  // const { toast } = useToast();

  const handleLike = () => {
    if (!currentUser) {
        // toast({ title: "برای پسندیدن باید وارد شوید", variant: "destructive" });
        alert("برای انجام این کار باید وارد حساب کاربری شوید.");
        return;
    }
    // Logic to like comment would go here in a real app context
    // For now we just show the thought process
  };

  const handleReplyClick = () => {
      if (!currentUser) {
          alert("برای پاسخ دادن باید وارد حساب کاربری شوید.");
          return;
      }
      setIsReplying(!isReplying);
  };

  return (
    <div className={cn("flex gap-3", depth > 0 && "mt-4")}>
      <Avatar src={comment.author.avatarUrl} alt={comment.author.displayName} size="sm" />
      
      <div className="flex-1 space-y-2">
        <div className="bg-gray-50 dark:bg-[#16181e] rounded-2xl rounded-tr-none p-4 border border-gray-100 dark:border-white/[0.06]">
           <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                 <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{comment.author.displayName}</span>
                 <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString('fa-IR')}</span>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
                 <MoreHorizontal className="w-4 h-4" />
              </button>
           </div>
           <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
             {comment.content}
           </p>
        </div>

        <div className="flex items-center gap-4 px-2">
           <button 
             onClick={handleLike}
             className={cn("flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer", comment.isLikedByCurrentUser ? "text-pink-500" : "text-gray-500 hover:text-pink-500")}
           >
              <Heart className={cn("w-3.5 h-3.5", comment.isLikedByCurrentUser && "fill-current")} />
              {comment.likesCount > 0 && <span>{comment.likesCount}</span>}
               پسندیدن
           </button>
           <button 
             onClick={handleReplyClick}
             className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-green-500 transition-colors cursor-pointer"
           >
              <CornerDownRight className="w-3.5 h-3.5" />
              پاسخ
           </button>
        </div>

        {isReplying && (
            <div className="flex gap-2 mt-2 animate-in fade-in slide-in-from-top-2">
                <input 
                  type="text" 
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`پاسخ به ${comment.author.displayName}...`}
                  className="flex-1 bg-white dark:bg-[#16181e] border border-gray-200 dark:border-white/[0.06] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-green-500"
                  autoFocus
                />
                <SocialButton size="sm" variant="primary" onClick={() => { setIsReplying(false); setReplyContent(''); }}>
                    ارسال
                </SocialButton>
            </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="pr-4 border-r-2 border-gray-100 dark:border-white/[0.06] space-y-4">
             {comment.replies.map(reply => (
               <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const CommentSection: React.FC<{ comments: SocialComment[] }> = ({ comments }) => {
    const { currentUser } = useSocial();
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            alert("برای ثبت دیدگاه باید وارد حساب کاربری شوید.");
            return;
        }
        if (!newComment.trim()) return;
        
        // Mock submission
        setNewComment('');
    };

    return (
        <div className="space-y-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                دیدگاه‌ها
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#16181e] px-2 py-0.5 rounded-full">{comments.length}</span>
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="flex gap-4 items-start">
               <Avatar src={currentUser?.avatarUrl} alt={currentUser?.displayName || "Guest"} size="md" />
               <div className="flex-1 relative">
                  <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={currentUser ? "دیدگاه خود را بنویسید..." : "برای نوشتن دیدگاه وارد شوید"}
                    className="w-full bg-gray-50 dark:bg-[#16181e] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-4 min-h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none transition-all"
                    disabled={!currentUser}
                  />
                  <div className="absolute bottom-3 left-3">
                     <SocialButton 
                        type="submit" 
                        size="sm" 
                        variant="primary" 
                        disabled={!currentUser || !newComment.trim()}
                        leftIcon={<Send className="w-3.5 h-3.5" />}
                     >
                        ارسال
                     </SocialButton>
                  </div>
               </div>
            </form>

            <div className="space-y-6">
               {comments.map(comment => (
                 <CommentItem key={comment.id} comment={comment} />
               ))}
               {comments.length === 0 && (
                 <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                    هنوز دیدگاهی ثبت نشده است. اولین نفر باشید!
                 </div>
               )}
            </div>
        </div>
    );
};
