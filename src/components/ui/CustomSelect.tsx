"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: "default" | "primary";
  size?: "sm" | "md";
}

export default function CustomSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "انتخاب کنید...",
  className,
  error,
  icon,
  variant = "default",
  size = "md"
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn("relative w-full space-y-2", className)} ref={containerRef} dir="rtl">
      {label && (
        <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mr-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center justify-between transition-all outline-none border",
            size === "sm" ? "px-4 py-2.5 rounded-xl text-xs" : "px-6 py-3.5 rounded-2xl text-sm",
            variant === "default" 
              ? "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-900 dark:text-white"
              : "bg-primary border-primary text-white shadow-lg shadow-primary/20",
            "font-bold text-right",
            isOpen 
              ? (variant === "default" ? "ring-4 ring-primary/10 border-primary shadow-lg" : "scale-[0.98]") 
              : (variant === "default" ? "hover:border-gray-300 dark:hover:border-white/20" : "hover:opacity-90"),
            error ? "border-red-500 ring-red-500/10" : ""
          )}
        >
          <div className={cn("flex items-center overflow-hidden", size === "sm" ? "gap-2" : "gap-3")}>
            {icon && (
              <span className={cn(
                "shrink-0 transition-colors",
                isOpen && variant === "default" ? "text-primary" : "text-gray-400",
                variant === "primary" && "text-white",
                size === "sm" ? "[&>svg]:w-3.5 [&>svg]:h-3.5" : "[&>svg]:w-4 [&>svg]:h-4"
              )}>
                {icon}
              </span>
            )}
            <span className={cn("truncate", !selectedOption && variant === "default" && "text-gray-400 font-medium")}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown 
            className={cn(
              size === "sm" ? "w-4 h-4" : "w-5 h-5",
              "transition-transform duration-300 shrink-0",
              variant === "default" ? "text-gray-400" : "text-white/80",
              isOpen && (variant === "default" ? "rotate-180 text-primary" : "rotate-180")
            )} 
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 4, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "absolute top-full right-0 left-0 z-50 mt-2 p-2 rounded-2xl overflow-hidden shadow-2xl",
                "bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/10 backdrop-blur-xl"
              )}
            >
              <div className="max-h-[280px] overflow-y-auto custom-scrollbar space-y-1">
                {options.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-right group",
                        isSelected 
                          ? "bg-primary text-white shadow-lg shadow-primary/20" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                      )}
                    >
                      <span className="font-bold text-sm">{option.label}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="shrink-0"
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="text-xs font-bold text-red-500 mr-1 mt-1">{error}</p>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--primary), 0.1);
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}
