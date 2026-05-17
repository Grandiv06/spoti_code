import React from "react";
import { Course } from "./types";
import { 
  BookOpen, 
  CheckCircle, 
  Code2, 
  Users, 
  TrendingUp, 
  Server 
} from "lucide-react";

interface CoursesStatsProps {
  courses: Course[];
}

export default function CoursesStats({ courses }: CoursesStatsProps) {
  // Calculations
  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.status === "منتشر شده").length;
  
  // Dynamic Frontend and Backend sales (sum of students in respective category)
  const frontendSales = courses
    .filter((c) => c.category === "Frontend")
    .reduce((sum, c) => sum + c.students, 0);

  const backendSales = courses
    .filter((c) => c.category === "Backend")
    .reduce((sum, c) => sum + c.students, 0);
  
  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const totalRevenue = courses.reduce((sum, c) => sum + c.revenue, 0);

  // Format Revenue
  const formatRevenue = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} میلیارد تومان`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)} میلیون تومان`;
    }
    return `${value.toLocaleString("fa-IR")} تومان`;
  };

  const statItems = [
    {
      title: "کل دوره‌ها",
      value: totalCourses.toLocaleString("fa-IR"),
      desc: "همه دوره‌های ثبت شده",
      icon: BookOpen,
      color: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400 border-blue-500/10",
      glow: "bg-blue-500/10",
    },
    {
      title: "دوره‌های منتشر شده",
      value: publishedCourses.toLocaleString("fa-IR"),
      desc: "در حال فروش و تدریس",
      icon: CheckCircle,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/10",
      glow: "bg-emerald-500/10",
    },
    {
      title: "فروش فرانت‌اند",
      value: frontendSales.toLocaleString("fa-IR"),
      desc: "ثبت‌نام دوره‌های Frontend",
      icon: Code2,
      color: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-500/10",
      glow: "bg-amber-500/10",
    },
    {
      title: "کل دانشجوها",
      value: totalStudents.toLocaleString("fa-IR"),
      desc: "دانشجویان ثبت نام شده",
      icon: Users,
      color: "from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 border-purple-500/10",
      glow: "bg-purple-500/10",
    },
    {
      title: "مجموع درآمد دوره‌ها",
      value: formatRevenue(totalRevenue),
      desc: "فروش کل دوره‌ها",
      icon: TrendingUp,
      color: "from-emerald-500/20 to-green-500/20 text-emerald-500 dark:text-emerald-300 border-emerald-500/20",
      glow: "bg-emerald-500/15",
      isHighlight: true,
    },
    {
      title: "فروش بک‌اند",
      value: backendSales.toLocaleString("fa-IR"),
      desc: "ثبت‌نام دوره‌های Backend",
      icon: Server,
      color: "from-cyan-500/20 to-sky-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/10",
      glow: "bg-cyan-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {statItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-3xl border p-5 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${
              item.isHighlight 
                ? "bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-primary/10 dark:to-teal-500/5 border-emerald-500/20 dark:border-primary/20 shadow-lg shadow-emerald-500/5"
                : "bg-white dark:bg-[#1c1e26] border-gray-100 dark:border-white/5 shadow-md"
            }`}
          >
            {/* Glow Background effect */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -translate-y-1/3 translate-x-1/3 pointer-events-none ${item.glow}`} />

            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[11px] font-black text-gray-500 dark:text-gray-400">{item.title}</span>
              <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color}`}>
                <IconComponent className="w-4 h-4 shrink-0" />
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-none mb-1">
                {item.value}
              </h3>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500">
                {item.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
