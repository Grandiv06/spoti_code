import React from 'react';
import { SocialPost } from '@/types/social';
import { ProjectCard } from './ProjectCard';
import { Flame } from 'lucide-react';

interface FeaturedSectionProps {
  projects: SocialPost[];
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ projects }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6 px-2">
        <div className="p-2 rounded-full bg-orange-500/10 text-orange-500">
            <Flame className="w-5 h-5 fill-current" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">برترین‌های هفته</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.slice(0, 3).map(project => (
            <ProjectCard key={project.id} post={project} variant="featured" />
        ))}
      </div>
    </div>
  );
};
