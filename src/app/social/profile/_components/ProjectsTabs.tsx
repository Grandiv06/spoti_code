"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Github, ExternalLink, Star, CheckCircle, Clock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const spoticodeProjects = [
  {
    id: 1,
    title: "فروشگاه فرانت‌هوک",
    mission: "مأموریت پایان فصل ۱",
    status: "approved",
    score: 95,
    thumbnail: "/images/placeholders/project-1.jpg", 
    demoUrl: "#",
    githubUrl: "#",
    date: "2 روز پیش",
  },
  {
    id: 2,
    title: "سیستم مدیریت تسک",
    mission: "تمرین جاوااسکریپت",
    status: "featured",
    score: 100,
    thumbnail: "/images/placeholders/project-2.jpg",
    demoUrl: "#",
    githubUrl: "#",
    date: "1 هفته پیش",
  },
  {
    id: 3,
    title: "لندینگ پیج شخصی",
    mission: "پروژه HTML/CSS",
    status: "submitted",
    score: null,
    thumbnail: "/images/placeholders/project-3.jpg",
    demoUrl: "#",
    githubUrl: "#",
    date: "2 هفته پیش",
  },
];

const freeProjects = [
  {
    id: 101,
    title: "کتابخانه React Hook Form",
    description: "یک فرم ساز ساده با استفاده از هوک‌های سفارشی.",
    tags: ["React", "TypeScript", "NPM"],
    stars: 12,
    thumbnail: "/images/placeholders/free-1.jpg",
  },
  {
    id: 102,
    title: "UI Kit فارسی",
    description: "مجموعه کامپوننت‌های راست‌چین برای Tailwind.",
    tags: ["CSS", "Tailwind", "RTL"],
    stars: 45,
    thumbnail: "/images/placeholders/free-2.jpg",
  },
];

const ProjectsTabs = () => {
  const [activeTab, setActiveTab] = useState<"spoticode" | "free">("spoticode");

  return (
    <div className="bg-white/60 dark:bg-[#1c1e26]/60 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-6 shadow-sm min-h-[500px]">
      {/* Tabs Header */}
      <div className="flex items-center gap-4 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
        <button
          onClick={() => setActiveTab("spoticode")}
          className={cn(
            "pb-4 -mb-[17px] px-2 font-bold text-lg transition-colors border-b-2",
            activeTab === "spoticode"
              ? "text-green-500 border-green-500"
              : "text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-300"
          )}
        >
          پروژه‌های اسپوتیکد
        </button>
        <button
          onClick={() => setActiveTab("free")}
          className={cn(
            "pb-4 -mb-[17px] px-2 font-bold text-lg transition-colors border-b-2",
            activeTab === "free"
              ? "text-green-500 border-green-500"
              : "text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-300"
          )}
        >
          پروژه‌های آزاد
        </button>
      </div>

      {/* Filters (Visual Only) */}
      <div className="flex gap-2 mb-6 overflow-x-auto py-1 hide-scrollbar">
        {["جدیدترین", "تایید شده ✅", "ویژه ⭐"].map((filter) => (
          <button
            key={filter}
            className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-colors whitespace-nowrap"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTab === "spoticode"
          ? spoticodeProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-white dark:bg-[#14161c] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="h-40 w-full bg-gray-200 dark:bg-gray-800 relative">
                   {/* Placeholder visual since we don't have real images yet */}
                   <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                      <span className="text-4xl opacity-20">🖼️</span>
                   </div>
                   
                   {/* Badges */}
                   <div className="absolute top-3 right-3 flex gap-2">
                      {project.status === "featured" && (
                          <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                              <Star className="w-3 h-3 fill-current" />
                              ویژه
                          </span>
                      )}
                      {project.status === "approved" && (
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                              <CheckCircle className="w-3 h-3" />
                              تایید شده
                          </span>
                      )}
                   </div>
                </div>

                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium mb-1 block">
                                {project.mission}
                            </span>
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg group-hover:text-green-500 transition-colors">
                                {project.title}
                            </h3>
                        </div>
                        {project.score && (
                            <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 p-1.5 rounded-lg min-w-[3rem]">
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{project.score}</span>
                                <span className="text-[10px] text-gray-400">امتیاز</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-50 dark:border-gray-800">
                        <a href={project.githubUrl} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <Github className="w-3.5 h-3.5" />
                            سورس کد
                        </a>
                        <a href={project.demoUrl} className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 transition-colors mr-auto">
                            <ExternalLink className="w-3.5 h-3.5" />
                            مشاهده دمو
                        </a>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {project.date}
                        </span>
                    </div>
                </div>
              </div>
            ))
          : freeProjects.map((project) => (
             <div
                key={project.id}
                className="group relative bg-white dark:bg-[#14161c] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all"
              >
                  <div className="p-5">
                      <div className="flex justify-between items-start">
                           <div className="bg-orange-100 dark:bg-orange-900/20 text-orange-600 p-2 rounded-xl mb-3 inline-block">
                                <Github className="w-6 h-6" />
                           </div>
                           <div className="flex items-center gap-1 text-gray-500 text-sm">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                {project.stars}
                           </div>
                      </div>
                      
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">
                            {project.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                            {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-auto">
                            {project.tags.map(tag => (
                                <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-md flex items-center gap-1">
                                    <Tag className="w-3 h-3" />
                                    {tag}
                                </span>
                            ))}
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default ProjectsTabs;
