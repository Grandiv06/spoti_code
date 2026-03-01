import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { SocialButton } from '@/components/social/SocialButton';

interface ExploreHeroProps {
  onCreatePost: () => void;
  showCreateButton?: boolean;
}

export const ExploreHero: React.FC<ExploreHeroProps> = ({ onCreatePost, showCreateButton = true }) => {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-gray-900 to-black p-8 md:p-12 text-white shadow-2xl shadow-green-900/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 bg-[url('/patterns/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,transparent)]" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-green-300 mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>بهترین مکان برای نمایش کد شما</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">کاوش در دنیای</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">پروژه‌های برنامه‌نویسی</span>
            </h1>
            
            <p className="text-lg text-gray-400 leading-relaxed max-w-lg mx-auto md:mx-0">
                اینجا جاییه که می‌تونی ایده‌های ناب رو پیدا کنی، از بقیه یاد بگیری و پروژه خودت رو به هزاران دولوپر دیگه نشون بدی.
            </p>
        </div>

        {showCreateButton && (
            <div className="shrink-0 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-500" />
                <button
                    onClick={onCreatePost}
                    className="relative flex items-center gap-3 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg transition-transform active:scale-95 cursor-pointer"
                >
                    <Plus className="w-6 h-6 text-green-500" />
                    <span>ایجاد پروژه جدید</span>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
