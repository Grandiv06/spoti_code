"use client";

import React from "react";
import { CheckCircle2, Lock, ArrowUpCircle, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";

const stages = [
  { id: 1, title: "HTML & Semantic Web", status: "completed", progress: 100 },
  { id: 2, title: "CSS & Modern Layouts", status: "completed", progress: 100 },
  { id: 3, title: "JavaScript Deep Dive", status: "completed", progress: 100 },
  { id: 4, title: "Git & Version Control", status: "active", progress: 45 },
  { id: 5, title: "React.js Framework", status: "locked", progress: 0 },
  { id: 6, title: "Next.js & SSR", status: "locked", progress: 0 },
];

const GrowthRoadmap = () => {
  return (
    <div className="bg-white/60 dark:bg-[#1c1e26]/60 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-8 bg-green-500 rounded-full mr-2"></span>
            مسیر رشد Frontend
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mr-4">
            سطح فعلی: Junior Developer
          </p>
        </div>
        <div className="text-right">
            <span className="text-3xl font-black text-green-600 dark:text-green-500">46%</span>
            <span className="block text-xs text-gray-400 uppercase tracking-wider font-medium">پیشرفت کل</span>
        </div>
      </div>

      <div className="relative pr-4">
        {/* Connector Line */}
        <div className="absolute top-4 bottom-4 right-[19px] w-0.5 bg-gray-200 dark:bg-gray-800" />

        <div className="space-y-8 relative">
          {stages.map((stage, index) => (
            <div key={stage.id} className="relative flex items-start gap-4 group">
              {/* Node Indicator */}
              <div
                className={cn(
                  "relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300",
                  stage.status === "completed"
                    ? "bg-green-500 border-green-100 dark:border-green-900 text-white shadow-lg shadow-green-500/20"
                    : stage.status === "active"
                    ? "bg-white dark:bg-[#1c1e26] border-green-500 text-green-500 scale-110 shadow-xl shadow-green-500/10 ring-4 ring-green-500/20"
                    : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400"
                )}
              >
                {stage.status === "completed" && <CheckCircle2 className="w-5 h-5" />}
                {stage.status === "active" && <CircleDot className="w-5 h-5 animate-pulse" />}
                {stage.status === "locked" && <Lock className="w-4 h-4" />}
              </div>

              {/* Content Card */}
              <div 
                className={cn(
                  "flex-1 p-4 rounded-2xl border transition-all duration-300",
                   stage.status === "active" 
                   ? "bg-gradient-to-l from-green-50/50 to-transparent dark:from-green-900/10 dark:to-transparent border-green-200 dark:border-green-500/30 transform translate-x-[-8px]" 
                   : "bg-transparent border-transparent hover:bg-gray-50/50 dark:hover:bg-white/5"
                )}
              >
                <div className="flex justify-between items-center mb-2">
                    <h3 className={cn(
                        "font-bold text-base md:text-lg",
                        stage.status === "locked" ? "text-gray-400" : "text-gray-800 dark:text-gray-200"
                    )}>
                        {stage.title}
                    </h3>
                    {stage.status === "active" && (
                        <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-lg">
                            در حال یادگیری
                        </span>
                    )}
                </div>

                {stage.status !== "locked" && (
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                            className="bg-green-500 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${stage.progress}%` }}
                        />
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GrowthRoadmap;
