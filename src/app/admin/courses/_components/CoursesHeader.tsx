import React from "react";
import { GraduationCap, Plus } from "lucide-react";

interface CoursesHeaderProps {
  onCreateCourseClick: () => void;
}

export default function CoursesHeader({ onCreateCourseClick }: CoursesHeaderProps) {
  return (
    <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-8">
      {/* Premium Glow Circles */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/30 transition-colors" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform duration-500">
              <GraduationCap className="w-8 h-8" />
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">مدیریت دوره‌ها</h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
              مدیریت، بررسی وضعیت، فروش، دانشجوها و درآمد هر دوره
            </p>
          </div>
        </div>

        <button
          onClick={onCreateCourseClick}
          className="flex items-center gap-1.5 px-6 py-3.5 bg-primary hover:bg-emerald-600 text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>ایجاد دوره جدید</span>
        </button>
      </div>
    </div>
  );
}
