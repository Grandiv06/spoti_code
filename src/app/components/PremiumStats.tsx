"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const stats = [
  {
    id: 1,
    value: 10000,
    suffix: "+",
    label: "دانشجوی مستعد",
    icon: "school",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-400",
    bgLight: "bg-emerald-50",
    bgDark: "dark:bg-emerald-500/10",
    textLight: "text-emerald-600",
    textDark: "dark:text-emerald-400",
    borderLight: "border-emerald-200",
    borderDark: "dark:border-emerald-500/20",
    shadow: "hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)]",
  },
  {
    id: 2,
    value: 50,
    suffix: "+",
    label: "دوره تخصصی",
    icon: "menu_book",
    color: "blue",
    gradient: "from-blue-500 to-indigo-400",
    bgLight: "bg-blue-50",
    bgDark: "dark:bg-blue-500/10",
    textLight: "text-blue-600",
    textDark: "dark:text-blue-400",
    borderLight: "border-blue-200",
    borderDark: "dark:border-blue-500/20",
    shadow: "hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)]",
    extra: {
      icon: "timer",
      text: "۱۵۰۰+ ساعت مدون",
    },
  },
  {
    id: 3,
    value: 24,
    suffix: "/۷",
    label: "پشتیبانی اختصاصی",
    icon: "support_agent",
    color: "purple",
    gradient: "from-purple-500 to-fuchsia-400",
    bgLight: "bg-purple-50",
    bgDark: "dark:bg-purple-500/10",
    textLight: "text-purple-600",
    textDark: "dark:text-purple-400",
    borderLight: "border-purple-200",
    borderDark: "dark:border-purple-500/20",
    shadow: "hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.3)]",
  },
  {
    id: 4,
    value: 150,
    suffix: "+",
    label: "پروژه عملی و واقعی",
    icon: "rocket_launch",
    color: "amber",
    gradient: "from-amber-500 to-orange-400",
    bgLight: "bg-amber-50",
    bgDark: "dark:bg-amber-500/10",
    textLight: "text-amber-600",
    textDark: "dark:text-amber-400",
    borderLight: "border-amber-200",
    borderDark: "dark:border-amber-500/20",
    shadow: "hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.3)]",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function PremiumStats() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 dark:bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10 mix-blend-screen"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={inView ? { opacity: 1, y: 0 } : {}}
             transition={{ duration: 0.6 }}
             className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full text-sm font-bold text-gray-700 dark:text-gray-300 shadow-sm mb-6"
           >
             <span className="material-symbols-outlined text-primary text-[18px]">workspace_premium</span>
             اعداد ما، اعتبار ماست
           </motion.div>
           
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             animate={inView ? { opacity: 1, y: 0 } : {}}
             transition={{ duration: 0.6, delay: 0.1 }}
             className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight"
           >
             چرا هزاران دانشجو{" "}
             <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-emerald-600 relative inline-block">
               اسپاتی‌کد
             </span>{" "}
             را انتخاب کردند؟
           </motion.h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`
                relative bg-white dark:bg-[#161920] rounded-[2rem] p-8 overflow-hidden
                border border-gray-100 dark:border-white/5
                shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none
                ${stat.shadow} transition-all duration-300 group
              `}
            >
              {/* Card Hover Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-gray-50/50 dark:from-transparent dark:to-white/[0.02] z-0"></div>
              
              {/* Corner Glow based on stat color */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 bg-${stat.color}-400/20 dark:bg-${stat.color}-500/20 rounded-full blur-[40px] group-hover:bg-${stat.color}-400/30 transition-all duration-500`}></div>

              <div className="relative z-10 flex flex-col h-full">
                {/* Header: Icon */}
                <div className="flex justify-between items-start mb-8">
                  <div
                    className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center 
                      ${stat.bgLight} ${stat.bgDark}
                      ${stat.borderLight} ${stat.borderDark}
                      border shadow-inner
                      group-hover:rotate-[-5deg] group-hover:scale-110 transition-transform duration-500
                    `}
                  >
                    <span className={`material-symbols-outlined text-3xl font-black ${stat.textLight} ${stat.textDark}`}>
                      {stat.icon}
                    </span>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold font-mono text-sm border border-gray-100 dark:border-white/5`}>
                    0{index + 1}
                  </div>
                </div>

                {/* Body: Number and Label */}
                <div className="mt-auto">
                  <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 flex flex-row-reverse justify-end items-end gap-1 font-mono tracking-tighter" dir="ltr">
                    <span className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${stat.gradient}`}>
                      {stat.suffix}
                    </span>
                    {inView ? (
                      <CountUp
                        end={stat.value}
                        duration={3}
                        separator=","
                        useEasing={true}
                        preserveValue={true}
                      />
                    ) : (
                      "0"
                    )}
                  </h3>
                  
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${stat.gradient}`}></div>
                    <div>
                      <p className="text-base font-black text-gray-700 dark:text-gray-200">
                        {stat.label}
                      </p>
                      {stat.extra && (
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">{stat.extra.icon}</span>
                          {stat.extra.text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
