"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillSelectProps {
  label: string;
  options: string[];
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
  iconColor?: string;
}

export function SkillSelect({
  label,
  options,
  selectedSkills,
  onChange,
  placeholder = "جستجو و انتخاب...",
  iconColor = "bg-primary",
}: SkillSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      onChange([...selectedSkills, skill]);
    } else {
      onChange(selectedSkills.filter((s) => s !== skill));
    }
    setSearchQuery("");
  };

  const handleRemove = (skill: string) => {
    onChange(selectedSkills.filter((s) => s !== skill));
  };

  return (
    <div className="space-y-3" ref={containerRef}>
      {/* Label */}
      <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 px-1">
        <div className={cn("w-2 h-2 rounded-full", iconColor)} />
        <span>{label}</span>
      </div>

      {/* Input / Dropdown Toggle */}
      <div className="relative">
        <div
          className={cn(
            "relative flex items-center w-full px-4 py-3 rounded-xl border transition-all cursor-text",
            isOpen
              ? "border-primary ring-2 ring-primary/10 bg-white dark:bg-[#1c1e26]"
              : "border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-[#14161c] hover:border-gray-300 dark:hover:border-white/20"
          )}
          onClick={() => setIsOpen(true)}
        >
          <Search className="w-4 h-4 text-gray-400 ml-3" />
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 py-2 overflow-auto max-h-60 rounded-2xl border border-gray-100 dark:border-white/[0.08] bg-white dark:bg-[#1c1e26] shadow-xl animate-in fade-in zoom-in-95 duration-200">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = selectedSkills.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-2.5 text-sm text-right transition-colors",
                      isSelected
                        ? "bg-primary/5 text-primary font-bold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                    )}
                  >
                    <span>{option}</span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-gray-400 text-sm">
                موردی یافت نشد
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Skills Tags */}
      <div className="flex flex-wrap gap-2">
        {selectedSkills.map((skill) => (
          <div
            key={skill}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1c1e26] border border-gray-200 dark:border-white/[0.08] rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm animate-in zoom-in-95"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => handleRemove(skill)}
              className="p-0.5 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
