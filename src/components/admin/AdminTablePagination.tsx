"use client";

import React, { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

type AdminTablePaginationProps = {
  totalItems: number;
  currentPage: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  itemLabel?: string;
  rowsPerPageOptions?: number[];
};

function toPersianDigits(value: number) {
  return value.toLocaleString("fa-IR");
}

export default function AdminTablePagination({
  totalItems,
  currentPage,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  itemLabel = "مورد",
  rowsPerPageOptions = [5, 10, 20, 50],
}: AdminTablePaginationProps) {
  const [isRowsMenuOpen, setIsRowsMenuOpen] = useState(false);
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const visiblePages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set([1, totalPages, safePage, safePage - 1, safePage + 1]);
    return Array.from(pages)
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((a, b) => a - b);
  }, [safePage, totalPages]);

  return (
    <div className="flex flex-col gap-4 border-t border-gray-100 px-4 py-4 dark:border-white/5 md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400 md:justify-start">
        <span>نمایش</span>
        <div
          className="relative w-24"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsRowsMenuOpen(false);
            }
          }}
        >
          <button
            type="button"
            onClick={() => setIsRowsMenuOpen((open) => !open)}
            className="flex h-10 w-full items-center justify-between gap-2 rounded-2xl border border-gray-100 bg-gray-50 pr-4 pl-3 text-xs font-black text-gray-700 outline-none transition hover:border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-black/20 dark:text-gray-200 dark:hover:border-white/20"
            aria-haspopup="listbox"
            aria-expanded={isRowsMenuOpen}
          >
            <span>{toPersianDigits(rowsPerPage)}</span>
            <ChevronLeft
              className={`h-3.5 w-3.5 -rotate-90 text-gray-400 transition-transform ${
                isRowsMenuOpen ? "rotate-90 text-primary" : ""
              }`}
            />
          </button>

          {isRowsMenuOpen ? (
            <div
              role="listbox"
              className="absolute bottom-full right-0 z-50 mb-2 w-full min-w-24 overflow-hidden rounded-2xl border border-gray-100 bg-white p-1.5 shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-[#1c1e26] dark:shadow-black/40"
            >
              {rowsPerPageOptions.map((option) => {
                const isSelected = rowsPerPage === option;
                return (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onRowsPerPageChange(option);
                      onPageChange(1);
                      setIsRowsMenuOpen(false);
                    }}
                    className={`flex h-9 w-full items-center justify-between rounded-xl px-3 text-xs font-black transition ${
                      isSelected
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                    }`}
                  >
                    <span>{toPersianDigits(option)}</span>
                    {isSelected ? <Check className="h-3.5 w-3.5" /> : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
        <span>
          از {toPersianDigits(totalItems)} {itemLabel}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {visiblePages.map((page, index) => {
          const previous = visiblePages[index - 1];
          const showEllipsis = previous !== undefined && page - previous > 1;

          return (
            <React.Fragment key={page}>
              {showEllipsis ? (
                <span className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => onPageChange(page)}
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition-all ${
                  page === safePage
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-black/20 dark:text-gray-300 dark:hover:bg-white/10"
                }`}
              >
                {toPersianDigits(page)}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 md:justify-end">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, safePage - 1))}
          disabled={safePage <= 1}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-gray-100 bg-white px-3 text-xs font-black text-gray-600 transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-black/20 dark:text-gray-300"
        >
          <ChevronRight className="h-4 w-4" />
          قبلی
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
          disabled={safePage >= totalPages}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-gray-100 bg-white px-3 text-xs font-black text-gray-600 transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-black/20 dark:text-gray-300"
        >
          بعدی
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
