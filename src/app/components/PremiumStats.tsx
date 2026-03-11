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
      {/* Decorative Background Elements - Hidden on mobile for performance */}
      <div className="hidden md:block absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 dark:bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10 mix-blend-screen"></div>
      <div className="hidden md:block absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center p-1.5 pl-5 pr-1.5 bg-gray-50/80 dark:bg-white/[0.03] backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-full text-sm font-black text-gray-700 dark:text-gray-300 shadow-sm mb-6 group hover:border-primary/30 dark:hover:bg-white/[0.05] transition-all duration-300 transform-gpu cursor-default"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ml-3 ml-2s shadow-inner group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-[18px]">workspace_premium</span>
              </div>
              <span className="ml-1 tracking-tight mt-0.5">مهم ترین هزینه برای یادگیری، وقت شماست</span>
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
          className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-8 lg:divide-x-0"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              className={`
                relative flex flex-col items-center justify-center text-center px-2 py-4
                group transition-all duration-300 transform-gpu
              `}
            >
              {/* Subtle background glow on hover */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-${stat.color}-400/20 dark:bg-${stat.color}-500/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>

              <div className="relative z-10 flex flex-col items-center w-full">
                {/* Header: Icon */}
                <div className={`
                    w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-5 md:mb-6
                    ${stat.bgLight} ${stat.bgDark}
                    ${stat.textLight} ${stat.textDark}
                    group-hover:-translate-y-1.5 transition-transform duration-500
                  `}
                >
                  <span className="material-symbols-outlined text-3xl md:text-4xl font-black">
                    {stat.icon}
                  </span>
                </div>

                {/* Body: Number and Label */}
                <div className="flex items-center justify-center gap-1 mb-2 md:mb-3 tracking-tight" dir="ltr">
                  <h3 className="text-3xl md:text-5xl lg:text-5xl font-black text-gray-900 dark:text-white flex items-center">
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
                  <span className={`text-xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r ${stat.gradient}`}>
                    {stat.suffix}
                  </span>
                </div>
                
                <p className="text-base md:text-lg font-bold text-gray-700 dark:text-gray-300">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
