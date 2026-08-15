"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
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
  renderOption?: (option: Option, selected: boolean) => React.ReactNode;
  renderValue?: (option?: Option) => React.ReactNode;
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
  size = "md",
  renderOption,
  renderValue
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateMenuPosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const gutter = 8;
    const estimatedHeight = 296;
    const spaceBelow = window.innerHeight - rect.bottom - gutter;
    const spaceAbove = rect.top - gutter;
    const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(
      120,
      Math.min(280, (openUp ? spaceAbove : spaceBelow) - 8),
    );

    setMenuStyle({
      position: "fixed",
      top: openUp ? undefined : rect.bottom + gutter,
      bottom: openUp ? window.innerHeight - rect.top + gutter : undefined,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
      maxHeight,
    });
  };

  useLayoutEffect(() => {
    if (!isOpen) return;
    updateMenuPosition();
    const handleReposition = () => updateMenuPosition();
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);
    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const menu = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          style={menuStyle}
          className={cn(
            "p-1.5 rounded-2xl overflow-hidden shadow-2xl",
            "bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/10 backdrop-blur-xl"
          )}
        >
          <div className="max-h-[inherit] overflow-y-auto custom-scrollbar space-y-1">
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
                    "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-right group cursor-pointer",
                    isSelected
                      ? "bg-primary/15 text-primary dark:text-emerald-400 border border-primary/30 font-bold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent"
                  )}
                >
                  {renderOption ? (
                    renderOption(option, isSelected)
                  ) : (
                    <>
                      <span className="font-bold text-sm">{option.label}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="shrink-0"
                        >
                          <Check className="w-4 h-4 text-primary dark:text-emerald-400" />
                        </motion.div>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={cn("relative w-full space-y-2", className)} ref={containerRef} dir="rtl">
      {label && (
        <label className={cn(
          "block font-black text-gray-700 dark:text-gray-300 mr-1",
          size === "sm" ? "text-[11px]" : "text-xs sm:text-sm"
        )}>
          {label}
        </label>
      )}

      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className={cn(
            "w-full flex items-center justify-between transition-all outline-none border cursor-pointer",
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
              {renderValue ? renderValue(selectedOption) : (selectedOption ? selectedOption.label : placeholder)}
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
      </div>

      {mounted ? createPortal(menu, document.body) : null}

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
