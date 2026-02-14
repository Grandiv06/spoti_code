import React from 'react';
import { Badge } from '@/components/social/Badge';

interface TechStackProps {
  technologies: string[];
}

export const TechStack: React.FC<TechStackProps> = ({ technologies }) => {
  return (
    <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-6 border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">تکنولوژی‌های استفاده شده</h3>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <Badge key={tech} variant="secondary" className="px-3 py-1.5 text-sm">
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  );
};
