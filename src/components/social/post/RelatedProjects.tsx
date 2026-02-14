import React from 'react';
import { SocialPost } from '@/types/social';
import { PostCard } from '@/components/social/PostCard';

interface RelatedProjectsProps {
  projects: SocialPost[];
}

export const RelatedProjects: React.FC<RelatedProjectsProps> = ({ projects }) => {
  if (projects.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white px-2 border-r-4 border-green-500">پروژه‌های مشابه</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map(project => (
           <PostCard key={project.id} post={project} />
        ))}
      </div>
    </div>
  );
};
