import React from 'react';
import { Eye, Heart, MessageSquare } from 'lucide-react';

interface ProjectStatsProps {
  views: number;
  likes: number;
  comments: number;
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({ views, likes, comments }) => {
  return (
    <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400">
      <div className="flex items-center gap-2" title={`${views} بازدید`}>
        <Eye className="w-5 h-5" />
        <span className="font-medium text-sm">{views.toLocaleString('fa-IR')}</span>
      </div>
      <div className="flex items-center gap-2" title={`${likes} پسند`}>
        <Heart className="w-5 h-5" />
        <span className="font-medium text-sm">{likes.toLocaleString('fa-IR')}</span>
      </div>
      <div className="flex items-center gap-2" title={`${comments} نظر`}>
        <MessageSquare className="w-5 h-5" />
        <span className="font-medium text-sm">{comments.toLocaleString('fa-IR')}</span>
      </div>
    </div>
  );
};
